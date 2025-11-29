import {Button, Form, type FormInstance, Input, Space, Typography} from "antd";
import type {User} from "../../../types";

const { Title } = Typography;

interface ProfileEditFormProps {
    form: FormInstance;
    onFinish: (values: Partial<User>) => void;
    onCancel: () => void;
    isLoading: boolean;
}

const ProfileEditForm = ({ form, onFinish, onCancel, isLoading }: ProfileEditFormProps) => {
    return (
        <div>
            <Title level={4} className="mb-6">Cập nhật thông tin</Title>
            <Form form={form} layout="vertical" onFinish={onFinish}>
                <Form.Item name="fullName" label="Họ và Tên" rules={[{ required: true }]}>
                    <Input />
                </Form.Item>
                <Form.Item name="phoneNumber" label="Số điện thoại">
                    <Input />
                </Form.Item>
                <Form.Item name="address" label="Địa chỉ">
                    <Input />
                </Form.Item>
                <Form.Item name="avatar" label="URL Ảnh đại diện">
                    <Input />
                </Form.Item>
                <Form.Item name="age" label="Tuổi">
                    <Input />
                </Form.Item>
                <Form.Item>
                    <Space>
                        <Button type="primary" htmlType="submit" loading={isLoading}>
                            Lưu thay đổi
                        </Button>
                        <Button onClick={onCancel}>Hủy</Button>
                    </Space>
                </Form.Item>
            </Form>
        </div>
    );
};

export default ProfileEditForm;