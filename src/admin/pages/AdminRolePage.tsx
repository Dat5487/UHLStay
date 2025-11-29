import {Alert, Button, Form, message, Modal, Spin, type TableProps, Tag, Typography} from "antd";
import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {useState} from "react";
import type {Role} from "../../types";
import {createRole, deleteRole, fetchAllRoles, updateRole} from "../../services/rbacApi.ts";
import {PlusOutlined} from "@ant-design/icons";
import AdminTable from "../components/common/AdminTable.tsx";
import RoleForm from "../components/roles/RoleForm.tsx";

const {Title} = Typography;

const AdminRolePage = () => {
    const [form] = Form.useForm();
    const queryClient = useQueryClient();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingRole, setEditingRole] = useState<Role | null>(null);

    const {data: roles, isLoading, error} = useQuery({
        queryKey: ['admin_roles'],
        queryFn: fetchAllRoles
    });

    // Mutation
    const {mutate: create, isPending: isCreating} = useMutation({
        mutationFn: createRole,
        onSuccess: () => {
            message.success('Tạo vai trò thành công!');
            queryClient.invalidateQueries({queryKey: ['admin_roles']});
            setIsModalOpen(false);
        },
        onError: (err) => message.error(err.message),
    });

    const {mutate: update, isPending: isUpdating} = useMutation({
        mutationFn: updateRole,
        onSuccess: () => {
            message.success('Cập nhật thành công!');
            queryClient.invalidateQueries({queryKey: ['admin_roles']});
            setIsModalOpen(false);
        },
        onError: (err) => message.error(err.message),
    });

    const {mutate: remove} = useMutation({
        mutationFn: deleteRole,
        onSuccess: () => {
            message.success('Xóa vai trò thành công!');
            queryClient.invalidateQueries({queryKey: ['admin_roles']});
        },
        onError: (err) => message.error(err.message),
    });

    // Events
    const handleOpenModal = (role: Role | null) => {
        setEditingRole(role);
        setIsModalOpen(true);
    };
    const handleSubmit = (values: any) => {
        if (editingRole) {
            update({ ...values, id: editingRole.id });
        } else {
            create(values);
        }
    };

    const columns: TableProps<Role>['columns'] = [
        {title: 'ID', dataIndex: 'id', key: 'id', width: 80},
        {
            title: 'Tên vai trò',
            dataIndex: 'name',
            key: 'name',
            render: (name) => <Tag color="blue">{name.toUpperCase()}</Tag>
        },
        {
            title: 'Quyền hạn',
            dataIndex: 'permissions',
            key: 'permissions',
            width: '60%',
            render: (perms: string[]) => <div className="flex flex-wrap gap-1">{perms?.map(p => <Tag
                key={p}>{p}</Tag>) ?? 'Không có'}</div>
        },
    ]
    if (isLoading) return <Spin tip="Đang tải..." size="large" fullscreen />;
    if (error) return <Alert message="Lỗi tải dữ liệu" type="error" />;
    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <Title level={2} className="!m-0">Quản lý Tin đăng Phòng trọ</Title>
                <Button type="primary" icon={<PlusOutlined />} onClick={() => handleOpenModal(null)} size="large">
                    Thêm tin mới
                </Button>
            </div>
            <AdminTable dataSource={roles} columns={columns} isLoading={isLoading} onEdit={handleOpenModal} onDelete={remove} paginationConfig={{
                pageSize: 10,
                showSizeChanger: true,
                showQuickJumper: true,
                position: ['bottomCenter'],
            }}/>
            <Modal
                title={editingRole ? `Chỉnh sửa: ${editingRole.name.toUpperCase()}` : 'Tạo Vai trò mới'}
                open={isModalOpen}
                onCancel={() => setIsModalOpen(false)}
                footer={null}
                width={900}
            >
                <RoleForm
                    form={form}
                    initialValues={editingRole}
                    onSubmit={handleSubmit}
                    onCancel={() => setIsModalOpen(false)}
                    isLoading={isCreating || isUpdating}
                    isEditMode={!!editingRole}
                />
            </Modal>
        </div>
    );

}
export default AdminRolePage;