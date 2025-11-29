import {Button, Form, Input, type FormInstance} from "antd";
interface CommentFormProps {
    form: FormInstance;
    onFinish: (values: { content: string }) => void;
    isSubmitting: boolean;
    submitText?: string;
    placeholder?: string;
    onCancel?: () => void;
}
const CommentForm = ({
                         form,
                         onFinish,
                         isSubmitting,
                         submitText = 'Gửi bình luận',
                         placeholder = 'Viết bình luận của bạn...',
                         onCancel
                     }: CommentFormProps) => {

    return (
        <Form form={form} onFinish={onFinish}>
            <Form.Item name="content" rules={[{ required: true, message: 'Vui lòng nhập nội dung' }]} className="!mb-2">
                <Input.TextArea autoSize={{ minRows: 2, maxRows: 5 }} placeholder={placeholder} />
            </Form.Item>
            <Form.Item>
                <Button htmlType="submit" loading={isSubmitting} type="primary">{submitText}</Button>
                {onCancel && <Button onClick={onCancel}>Hủy</Button>}
            </Form.Item>
        </Form>
    )
}
export default CommentForm;