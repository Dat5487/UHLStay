import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
    Button,
    message,
    Typography,
    Spin,
    Alert,
    Modal,
    Form,
    type TableProps,
    Tag,
    Space,
    Image,
    type UploadFile
} from 'antd';
import {  PlusOutlined } from '@ant-design/icons';
import type {Motel} from "../../types";
import MotelForm from "../components/motels/MotelForm.tsx";
import {
    createMotel,
    deleteMotel,
    fetchAllMotelsForAdmin,
    updateMotel
} from "../../services/motelApi.ts";
import AdminTable from "../components/common/AdminTable.tsx";
import {convertUploadFilesToBase64, mapBase64ToUploadFile} from "../../utils/imageConverter.ts";

const { Title } = Typography;

type MotelFormValues = Omit<Motel, 'id' | 'createdAt' | 'images'> & {
    images?: UploadFile[];
};

type MotelPayload = Omit<Motel, 'id' | 'createdAt'>;

const AdminMotelPage = () => {
    const [form] = Form.useForm();
    const queryClient = useQueryClient();


    // State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingRecord, setEditingRecord] = useState<Motel | null>(null);

    // Claim data
    const { data: motels, isLoading, error } = useQuery({
        queryKey: ['motels', 'admin_list'],
        queryFn: fetchAllMotelsForAdmin
    });

    // Mutation
    const { mutate: create, isPending: isCreating } = useMutation({
        mutationFn: createMotel,
        onSuccess: () => {
            message.success('Tạo tin thành công!');
            queryClient.invalidateQueries({ queryKey: ['motels'] });
            setIsModalOpen(false);
        },
        onError: (err) => message.error(err.message),
    });

    const { mutate: update, isPending: isUpdating } = useMutation({
        mutationFn: updateMotel,
        onSuccess: () => {
            message.success('Cập nhật thành công!');
            queryClient.invalidateQueries({ queryKey: ['motels'] });
            setIsModalOpen(false);
        },
        onError: (err) => message.error(err.message),
    });

    const { mutate: remove } = useMutation({
        mutationFn: deleteMotel,
        onSuccess: () => {
            message.success('Xóa tin thành công!');
            queryClient.invalidateQueries({ queryKey: ['motels'] });
        },
        onError: (err) => message.error(err.message),
    });

    // Events
    const handleOpenModal = (motel: Motel | null) => {
        setEditingRecord(motel);

        if (motel) {
            const initialImages = mapBase64ToUploadFile(motel.images || []);
            form.setFieldsValue({
                ...motel,
                images: initialImages,
            });
        } else {
            form.resetFields();
        }

        setIsModalOpen(true);
    };
    const handleCancelModal = () => setIsModalOpen(false);
    const handleSubmit = async (values: MotelFormValues) => {
        const fileList = values.images || [];
        const base64Images = await convertUploadFilesToBase64(fileList);

        const payload: MotelPayload = {
            ...values,
            images: base64Images,
        };

        if (editingRecord) {
            update({ ...payload, id: editingRecord.id });
        } else {
            create(payload);
        }
    };

    // Frame
    const columns: TableProps<Motel>['columns'] = [
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
                    <Image width={100} height={100} src={record.images?.[0]} preview={false} className="rounded" />
                    <div>
                        <a className="font-semibold text-base">{record.title}</a>
                        <p className="text-xs text-gray-500 m-0">{record.district}, {record.city}</p>
                    </div>
                </Space>
            )
        },
        {
            title: 'Giá / Diện tích',
            dataIndex: 'price',
            key: 'price',
            render: (_, record) => (
                <div>
                    <p className="font-semibold text-red-500">{record.price.value.toLocaleString()} VNĐ</p>
                    <p className="text-xs text-gray-500">{record.area} m²</p>
                    <p className='text-xs text-gray-500'>{record.specs.capacity} người</p>
                </div>
            )
        },
        {
            title: 'Tiện nghi',
            dataIndex: 'amenities',
            key: 'amenities',
            responsive: ['lg'], // Chỉ hiện trên màn hình lớn
            render: (amenities: string[]) => (
                <div className="flex flex-wrap gap-1 max-w-[250px]">
                    {amenities?.map(tag => <Tag key={tag}>{tag}</Tag>).slice(0, 4)}
                    {amenities?.length > 4 && <Tag>...</Tag>}
                </div>
            ),
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            key: 'status',
            align: 'center',
            render: (status: Motel['status']) => {
                const color = status === 'published' ? 'green' : status === 'rented' ? 'red' : 'gold';
                return <Tag color={color}>{status}</Tag>;
            }
        },
        {
            title: 'Ngày tạo',
            dataIndex: 'createdAt',
            key: 'createdAt',
            responsive: ['md'], // Ẩn trên màn hình nhỏ
            render: (date: Date) => new Date(date).toLocaleDateString('vi-VN'),
        },
    ];

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
            <AdminTable dataSource={motels} columns={columns} isLoading={isLoading} onEdit={handleOpenModal} onDelete={remove} paginationConfig={{
                pageSize: 10,
                showSizeChanger: true,
                showQuickJumper: true,
                position: ['bottomCenter'],
            }}/>
            <Modal
                title={editingRecord ? `Chỉnh sửa tin: ID ${editingRecord.id}` : 'Tạo tin đăng mới'}
                open={isModalOpen}
                onCancel={handleCancelModal}
                footer={null}
                width={700}
            >
                <MotelForm
                    form={form}
                    initialValues={editingRecord}
                    onSubmit={handleSubmit}
                    onCancel={handleCancelModal}
                    isLoading={isCreating || isUpdating}
                />
            </Modal>
        </div>
    );
};

export default AdminMotelPage;