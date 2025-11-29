import {Avatar, Button, Form, message, Modal, Space, Spin, type TableProps, Tag, Typography} from "antd";
import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {useState} from "react";
import type {Role, User} from "../../types";
import {deleteUser, fetchAllUsers, updateUser} from "../services/adminApi.ts";
import {PlusOutlined, UserOutlined} from "@ant-design/icons";
import UserForm from "../components/users/UserForm.tsx";
import AdminTable from "../components/common/AdminTable.tsx";
import {apiRegister} from "../../services/authApi.ts";

const { Title } = Typography;

const AdminUserPage = () => {
    const [form] = Form.useForm();
    const queryClient = useQueryClient();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState<User | null>(null);

    const { data: users, isLoading } = useQuery({ queryKey: ['users', 'admin_list'], queryFn: fetchAllUsers });
    const commonMutationOptions = {
        onError: (error: Error) => {
            message.error(error.message); // Luôn hiển thị lỗi nếu có
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ['users'] });
        },
    };

    const { mutate: create, isPending: isCreating } = useMutation({
        mutationFn: apiRegister,
        ...commonMutationOptions,
        onSuccess: () => {
            message.success('Tạo người dùng thành công!');
            setIsModalOpen(false);
        },
    });

    const { mutate: update, isPending: isUpdating } = useMutation({
        mutationFn: updateUser,
        ...commonMutationOptions,
        onSuccess: () => {
            message.success('Cập nhật thành công!');
            setIsModalOpen(false);
        },
    });

    const { mutate: remove } = useMutation({
        mutationFn: deleteUser,
        onSuccess: () => {
            message.success('Xóa người dùng thành công!');
        },
        ...commonMutationOptions,
    });


    const handleOpenModal = (user: User | null) => {
        setEditingUser(user);
        setIsModalOpen(true);
    };
    const handleCancelModal = () => setIsModalOpen(false);
    const handleSubmit = (values: any) => {
        if (editingUser) {
            update({ ...editingUser, ...values });
        } else {
            create(values);
        }
    };

    const columns: TableProps<User>['columns']  = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
            width: 80,
        },
        {
            title: 'Người dùng',
            dataIndex: 'fullName',
            key: 'user',
            render: (_, record) => (
                <Space>
                    <Avatar src={record.avatar} icon={<UserOutlined />} />
                    <div>
                        <p className="font-semibold m-0">{record.fullName}</p>
                        <h2 className="text-xs text-gray-500 m-0">{record.email}</h2>
                    </div>
                </Space>
            )
        },
        { title: 'Giới tính', dataIndex: 'gender', key: 'gender' },
        {
            title: 'Vai trò',
            dataIndex: 'role',
            key: 'role',
            align: 'center',
            render: (role: Role) => {
                console.log(`Role name found: ${role.name}`);
                const color = role.name === 'admin' ? 'red' : role.name === 'landlord' ? 'blue' : 'default';
                return <Tag color={color}>{role.name}</Tag>;
            }
        },
    ];

    if (isLoading) return <Spin />;

    return (
        <div>
            <div className="flex justify-between items-center mb-4">
                <Title level={3} className={"!m-0"}>Danh sách Người dùng</Title>
                <Button type="primary" icon={<PlusOutlined />} onClick={() => handleOpenModal(null)} size={"large"}>
                    Thêm mới người dùng
                </Button>
            </div>
            <AdminTable
                dataSource={users}
                columns={columns}
                isLoading={isLoading}
                onEdit={handleOpenModal}
                onDelete={remove}
                paginationConfig={{
                    pageSize: 10,
                    showSizeChanger: true,
                    showQuickJumper: true,
                    position: ['bottomCenter'],
            }}/>
            <Modal
                title={editingUser ? 'Chỉnh sửa User' : 'Tạo mới User'}
                open={isModalOpen}
                onCancel={handleCancelModal}
                footer={null}
            >
                <UserForm
                    form={form}
                    initialValues={editingUser}
                    onSubmit={handleSubmit}
                    onCancel={handleCancelModal}
                    isLoading={isCreating || isUpdating}
                    isEditMode={!!editingUser}
                />
            </Modal>
        </div>
    )
}
export default AdminUserPage;