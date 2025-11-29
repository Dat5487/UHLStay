import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {Avatar, Button, Form, message, Modal, Space, Spin, type TableProps, Tag, Typography} from "antd";
import {useAppSelector} from "../../store/hooks.ts";
import {selectCurrentUser} from "../../store/slices/authSlice.ts";
import {useState} from "react";
import type {Post} from "../../types";
import {createPost, deletePost, fetchAllPosts, updatePost} from "../../services/blogApi.ts";
import {PlusOutlined} from "@ant-design/icons";
import PostForm from "../components/blogs/PostForm.tsx";
import AdminTable from "../components/common/AdminTable.tsx";

const {Title} = Typography;
const AdminBlogPage = () => {
    const [form] = Form.useForm();
    const queryClient = useQueryClient();
    const currentUser = useAppSelector(selectCurrentUser);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingPost, setEditingPost] = useState<Post | null>(null);

    const {data: posts, isLoading} = useQuery({queryKey: ['posts', 'admin_list'], queryFn: fetchAllPosts});

    const {mutate: create, isPending: isCreating} = useMutation({
        mutationFn: (values: Omit<Post, 'id' | 'slug' | 'publishedAt' | 'author'>) => createPost(values, {
            name: currentUser!.fullName,
            avatar: currentUser!.avatar || ''
        }),
        onSuccess: () => {
            message.success('Tạo bài viết thành công!');
            queryClient.invalidateQueries({queryKey: ['posts']});
            setIsModalOpen(false);
        },
        onError: (err) => message.error(err.message),
    });

    const {mutate: update, isPending: isUpdating} = useMutation({
        mutationFn: updatePost,
        onSuccess: () => {
            message.success('Cập nhật thành công!');
            queryClient.invalidateQueries({queryKey: ['posts']});
            setIsModalOpen(false);
        },
        onError: (err) => message.error(err.message),
    });

    const {mutate: remove} = useMutation({
        mutationFn: deletePost,
        onSuccess: () => message.success('Xóa bài viết thành công!'),
        onSettled: () => queryClient.invalidateQueries({queryKey: ['posts']}),
    });

    const handleOpenModal = (post: Post | null) => {
        setEditingPost(post);
        setIsModalOpen(true);
    };

    const handleCancelModal = () => setIsModalOpen(false);

    const handleSubmit = (values: any) => {
        if (editingPost) {
            update({...values, id: editingPost.id});
        } else {
            create(values);
        }
    };

    const columns: TableProps<Post>['columns'] = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
            width: 80,
        },
        {
            title: 'Tiêu đề bài viết',
            dataIndex: 'title',
            key: 'title',
            ellipsis: true,
        },
        {
            title: 'Tác giả',
            dataIndex: ['author', 'name'],
            key: 'author',
            render: (name, record) => (
                <Space>
                    <Avatar src={record.author.avatar} />
                    <span>{name}</span>
                </Space>
            )
        },
        {
            title: 'Tags',
            dataIndex: 'tags',
            key: 'tags',
            responsive: ['lg'],
            render: (tags: string[]) => (
                <Space size={[0, 8]} wrap>
                    {tags?.map(tag => <Tag key={tag} color="geekblue">{tag}</Tag>)}
                </Space>
            )
        },
        {
            title: 'Ngày xuất bản',
            dataIndex: 'publishedAt',
            key: 'publishedAt',
            responsive: ['md'],
            render: (val) => new Date(val).toLocaleDateString('vi-VN'),
        },
    ];

    if (isLoading) return <Spin fullscreen/>;
    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <Title level={2} className="!m-0">Quản lý Blog</Title>
                <Button type="primary" icon={<PlusOutlined/>} onClick={() => handleOpenModal(null)} size="large">
                    Viết bài mới
                </Button>
            </div>
            <AdminTable dataSource={posts} columns={columns} isLoading={isLoading} onEdit={handleOpenModal} onDelete={remove}
                        paginationConfig={{
                            pageSize: 10,
                            showSizeChanger: true,
                            showQuickJumper: true,
                            position: ['bottomCenter'],
                        }}/>
            <Modal
                title={editingPost ? `Chỉnh sửa bài viết: ${editingPost.title}` : 'Tạo bài viết mới'}
                open={isModalOpen}
                onCancel={handleCancelModal}
                footer={null}
                width={800}
            >
                <PostForm
                    form={form}
                    initialValues={editingPost}
                    onSubmit={handleSubmit}
                    onCancel={handleCancelModal}
                    isLoading={isCreating || isUpdating}
                    isEditMode={!!editingPost}
                />
            </Modal>
        </div>
    );
}
export default AdminBlogPage