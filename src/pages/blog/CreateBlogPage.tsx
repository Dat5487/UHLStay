import {Button, Card, Form, Input, message, Select, Typography} from "antd";
import type {Post} from "../../types";
import {useNavigate} from "react-router-dom";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import {useAppSelector} from "../../store/hooks.ts";
import {selectCurrentUser} from "../../store/slices/authSlice.ts";
import {createPost} from "../../services/blogApi.ts";

const { Title } = Typography;
const { TextArea } = Input;
type CreatePostData = Omit<Post, 'id' | 'slug' | 'publishedAt' | 'author'>;
const CreateBlogPage = () => {
    const [form] = Form.useForm<CreatePostData>();
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const currentUser = useAppSelector(selectCurrentUser);

    const { mutate: submitPost, isPending } = useMutation({
        mutationFn: (formValues: CreatePostData) => {
            if (!currentUser) {
                return Promise.reject(new Error('Bạn phải đăng nhập để đăng bài.'));
            }
            const authorInfo = {
                name: currentUser.fullName,
                avatar: currentUser.avatar || ''
            };
            return createPost(formValues, authorInfo);
        },
        onSuccess: (newPost) => {
            message.success('Đăng bài viết thành công!');
            queryClient.invalidateQueries({ queryKey: ['posts'] });
            navigate(`/blogs/${newPost.slug}`);
        },
        onError: (error) => message.error(error.message),
    });
    return (
        <div className="w-full mx-auto">
            <Card>
                <Title level={2} className="text-center">Tạo bài viết Blog mới</Title>
                <Form form={form} layout="vertical" onFinish={submitPost} size="large">
                    <Form.Item name="title" label="Tiêu đề bài viết" rules={[{ required: true }]}>
                        <Input placeholder="Tiêu đề hấp dẫn, thu hút người đọc" />
                    </Form.Item>
                    <Form.Item name="excerpt" label="Đoạn tóm tắt (Excerpt)" rules={[{ required: true }]}>
                        <TextArea rows={3} placeholder="Một đoạn mô tả ngắn gọn nội dung bài viết" />
                    </Form.Item>
                    <Form.Item name="content" label="Nội dung chính" rules={[{ required: true }]}>
                        <TextArea rows={15} placeholder="Viết nội dung đầy đủ của bạn ở đây. Bạn có thể dùng Markdown." />
                    </Form.Item>
                    <Form.Item name="tags" label="Gắn thẻ (Tags)">
                        <Select mode="tags" placeholder="Nhập các tag liên quan (ví dụ: react, frontend...)" />
                    </Form.Item>
                    <Form.Item name="imageUrl" label="URL hình ảnh đại diện">
                        <Input placeholder="https://example.com/image.jpg" />
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit" loading={isPending} block>
                            Xuất bản bài viết
                        </Button>
                    </Form.Item>
                </Form>
            </Card>
        </div>
    )
}
export default CreateBlogPage;