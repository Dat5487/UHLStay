import {Button, Form, type FormInstance, Input} from "antd";
import {SendOutlined} from "@ant-design/icons";

interface MessageInputProps {
    form: FormInstance;
    onSendMessage: (text: string) => void;
    isLoading: boolean;
}

const MessageInput = ({ form, onSendMessage, isLoading }: MessageInputProps) => {
    const handleFinish = ({ text }: { text: string }) => {
        if (text?.trim()) {
            onSendMessage(text.trim());
            form.resetFields();
        }
    };
    return (
        <Form form={form} onFinish={handleFinish} className="flex gap-2 p-4 border-t">
            <Form.Item name="text" className="flex-grow !mb-0">
                <Input size="large" placeholder="Nhập tin nhắn..." autoComplete="off"/>
            </Form.Item>
            <Button type="primary" htmlType="submit" size="large" icon={<SendOutlined />} loading={isLoading} />
        </Form>
    );
};
export default MessageInput;