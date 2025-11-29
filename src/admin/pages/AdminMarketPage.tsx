import {Button, Form, message, Modal, Spin, type TableProps, Typography, Space, Image, Tag} from "antd";
import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {useAppSelector} from "../../store/hooks.ts";
import {selectCurrentUser} from "../../store/slices/authSlice.ts";
import {useState} from "react";
import type {Item} from "../../types";
import {createItem, deleteItem, fetchAllItemsForAdmin, updateItem} from "../../services/marketApi.ts";
import { PlusOutlined} from "@ant-design/icons";
import ItemForm from "../components/markets/ItemForm.tsx";
import AdminTable from "../components/common/AdminTable.tsx";

const {Title} = Typography;

const AdminMarketPage = () => {
    const [form] = Form.useForm();
    const queryClient = useQueryClient();
    const currentUser = useAppSelector(selectCurrentUser);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<Item | null>(null);

    const {data: items, isLoading} = useQuery({
        queryKey: ['items', 'admin_list'],
        queryFn: fetchAllItemsForAdmin,
    });

    const {mutate: create, isPending: isCreating} = useMutation({
        mutationFn: (values: Omit<Item, 'id' | 'createdAt' | 'seller'>) => createItem(values, {
            id: currentUser!.id,
            name: currentUser!.fullName,
            avatar: currentUser!.avatar || ''
        }),
        onSuccess: () => {
            message.success('Tạo tin thành công!');
            queryClient.invalidateQueries({queryKey: ['items']});
            setIsModalOpen(false);
        },
        onError: (err) => message.error(err.message),
    });

    const {mutate: update, isPending: isUpdating} = useMutation({
        mutationFn: updateItem,
        onSuccess: () => {
            message.success('Cập nhật thành công!');
            queryClient.invalidateQueries({queryKey: ['items']});
            setIsModalOpen(false);
        },
        onError: (err) => message.error(err.message),
    });

    const {mutate: remove} = useMutation({
        mutationFn: deleteItem,
        onSuccess: () => {
            message.success('Xóa tin thành công!');
        },
        onError: (err) => message.error(err.message),
        onSettled: () => queryClient.invalidateQueries({queryKey: ['items']}),
    });

    const handleOpenModal = (item: Item | null) => {
        setEditingItem(item);
        setIsModalOpen(true);
    };

    const handleCancelModal = () => setIsModalOpen(false);

    const handleSubmit = (values: any) => {
        if (editingItem) {
            update({...values, id: editingItem.id});
        } else {
            create(values);
        }
    };

    const columns: TableProps<Item>['columns'] = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
            width: 60,
        },
        {
            title: 'Tin đăng',
            dataIndex: 'title',
            key: 'title',
            width: 350,
            render: (_, record) => (
                <Space>
                    <Image 
                        width={100} 
                        src={record.images?.[0] || 'https://via.placeholder.com/100x100?text=No+Image'} 
                        preview={false} 
                        className="rounded" 
                    />
                    <div>
                        <a className="font-semibold text-base">{record.title}</a>
                        <p className="text-xs text-gray-500 m-0">{record.location.building}, Tầng {record.location.floor}</p>
                    </div>
                </Space>
            )
        },
        {
            title: 'Giá / Danh mục',
            dataIndex: 'price',
            key: 'price',
            render: (_, record) => (
                <div>
                    <p className="font-semibold text-red-500">
                        {record.listingType === 'free' ? 'MIỄN PHÍ' : `${record.price.toLocaleString()}đ`}
                    </p>
                    <p className="text-xs text-gray-500">{record.category}</p>
                </div>
            )
        },
        {
            title: 'Tình trạng',
            dataIndex: 'condition',
            key: 'condition',
            align: 'center',
            render: (condition: Item['condition']) => {
                const color = condition === 'new' ? 'green' : condition === 'like_new' ? 'blue' : 'orange';
                const label = condition === 'new' ? 'Mới' : condition === 'like_new' ? 'Như mới' : 'Đã dùng';
                return <Tag color={color}>{label}</Tag>;
            }
        },
        {
            title: 'Hình thức',
            dataIndex: 'listingType',
            key: 'listingType',
            align: 'center',
            render: (listingType: Item['listingType']) => {
                const color = listingType === 'free' ? 'green' : listingType === 'trade' ? 'purple' : 'blue';
                const label = listingType === 'free' ? 'Cho tặng' : listingType === 'trade' ? 'Trao đổi' : 'Bán';
                return <Tag color={color}>{label}</Tag>;
            }
        },
        {
            title: 'Người bán',
            dataIndex: 'seller',
            key: 'seller',
            responsive: ['lg'],
            render: (seller: Item['seller']) => (
                <div className="text-center">
                    <p className="font-semibold text-sm">{seller.name}</p>
                </div>
            )
        },
        {
            title: 'Ngày tạo',
            dataIndex: 'createdAt',
            key: 'createdAt',
            responsive: ['md'],
            render: (date: Date) => new Date(date).toLocaleDateString('vi-VN'),
        },
    ];

    if (isLoading) return <Spin fullscreen/>;

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <Title level={2} className="!m-0">Quản lý Chợ đồ cũ</Title>
                <Button type="primary" icon={<PlusOutlined/>} onClick={() => handleOpenModal(null)} size="large">
                    Thêm sản phẩm
                </Button>
            </div>
            <AdminTable dataSource={items} columns={columns} isLoading={isLoading} onEdit={handleOpenModal} onDelete={remove}
                        paginationConfig={{
                            pageSize: 10,
                            showSizeChanger: true,
                            showQuickJumper: true,
                            position: ['bottomCenter'],
                        }}/>
            <Modal
                title={editingItem ? `Chỉnh sửa: ${editingItem.title}` : 'Thêm sản phẩm mới'}
                open={isModalOpen}
                onCancel={handleCancelModal}
                footer={null}
                width={700}
            >
                <ItemForm
                    form={form}
                    initialValues={editingItem}
                    onSubmit={handleSubmit}
                    onCancel={handleCancelModal}
                    isLoading={isCreating || isUpdating}
                    isEditMode={!!editingItem}
                />
            </Modal>
        </div>
    );
};

export default AdminMarketPage;