import {Button, Form, type FormInstance, Input, Select, Space} from "antd";
import type {Post} from "../../../types";
import {useEffect} from "react";

const { TextArea } = Input;
type PostFormData = Omit<Post, 'id' | 'slug' | 'publishedAt' | 'author'>;

interface PostFormProps {
    form: FormInstance;
    initialValues?: Partial<Post> | null;
    onSubmit: (values: PostFormData) => void;
    onCancel: () => void;
    isLoading: boolean;
    isEditMode: boolean;
}

const PostForm = ({ form, initialValues, onSubmit, onCancel, isLoading, isEditMode }: PostFormProps) =>
{
    useEffect(() => {
        if (initialValues) {
            form.setFieldsValue(initialValues);
        } else {
            form.resetFields();
        }
    }, [initialValues, form]);
    return (
        <Form form={form} layout="vertical" onFinish={onSubmit} size="large">
            <Form.Item name="title" label="Tiêu đề bài viết" rules={[{ required: true, message: 'Vui lòng nhập tiêu đề' }]}>
                <Input placeholder="Tiêu đề hấp dẫn, thu hút người đọc" />
            </Form.Item>
            <Form.Item name="excerpt" label="Đoạn tóm tắt (Excerpt)" rules={[{ required: true, message: 'Vui lòng nhập tóm tắt' }]}>
                <TextArea rows={3} placeholder="Một đoạn mô tả ngắn gọn nội dung bài viết" />
            </Form.Item>
            <Form.Item name="content" label="Nội dung chính" rules={[{ required: true, message: 'Vui lòng nhập nội dung' }]}>
                <TextArea rows={15} placeholder="Viết nội dung đầy đủ của bạn ở đây. Hỗ trợ Markdown." />
            </Form.Item>
            <Form.Item name="tags" label="Gắn thẻ (Tags)">
                <Select mode="tags" placeholder="Nhập các tag liên quan (ví dụ: react, frontend...)" />
            </Form.Item>
            <Form.Item name="imageUrl" label="URL hình ảnh đại diện" rules={[{ type: 'url', message: 'Vui lòng nhập URL hợp lệ' }]}>
                <Input placeholder="https://example.com/image.jpg" />
            </Form.Item>
            <Form.Item className="text-right mt-4">
                <Space>
                    <Button onClick={onCancel} disabled={isLoading}>Hủy</Button>
                    <Button type="primary" htmlType="submit" loading={isLoading}>
                        {isEditMode ? 'Cập nhật' : 'Xuất bản'}
                    </Button>
                </Space>
            </Form.Item>
        </Form>
    );
}
export default PostForm