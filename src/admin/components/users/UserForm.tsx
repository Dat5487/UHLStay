import {Button, Col, Form, type FormInstance, Input, InputNumber, Row, Select, Space} from "antd";
import {useEffect} from "react";
import type {User} from "../../../types";

interface UserFormProps {
    form: FormInstance;
    initialValues?: Partial<User> | null;
    onSubmit: (values: any) => void;
    onCancel: () => void;
    isLoading: boolean;
    isEditMode: boolean;
}

const UserForm = ({form, initialValues, onSubmit, onCancel, isLoading, isEditMode}: UserFormProps) => {
    useEffect(() => {
        if (initialValues) {
            const normalized = {
                ...initialValues,
                role: (initialValues as any).role?.name ?? (initialValues as any).role,
            };
            form.setFieldsValue(normalized);
        } else {
            form.resetFields();
        }
    }, [initialValues, form]);

    return (
        <Form form={form} layout="vertical" onFinish={onSubmit}>
            <Row gutter={16}>
                <Col span={12}>
                    <Form.Item name="email" label="Email" rules={[{required: true, type: 'email'}]}>
                        <Input/>
                    </Form.Item>
                </Col>
                <Col span={12}>
                    <Form.Item name="password" label="Mật khẩu" rules={[{
                        required: !isEditMode,
                        message: 'Vui lòng nhập mật khẩu!'
                    },
                        {
                            min: 6,
                            message: 'Mật khẩu cần ít nhất 6 ký tự.'
                        }]}>
                        <Input.Password placeholder={isEditMode ? "Để trống nếu không đổi" : "Nhập mật khẩu"}/>
                    </Form.Item>
                </Col>
                <Col span={12}>
                    <Form.Item name="fullName" label="Tên hiển thị" rules={[{required: true}]}>
                        <Input/>
                    </Form.Item>
                </Col>
                <Col span={12}>
                    <Form.Item name="age" label="Tuổi">
                        <InputNumber className="w-full"/>
                    </Form.Item>
                </Col>
                <Col span={12}>
                    <Form.Item name="gender" label="Giới tính">
                        <Select>
                            <Select.Option value="male">Nam</Select.Option>
                            <Select.Option value="female">Nữ</Select.Option>
                            <Select.Option value="other">Khác</Select.Option>
                        </Select>
                    </Form.Item>
                </Col>
                <Col span={12}>
                    <Form.Item name="role" label="Vai trò" rules={[{ required: !isEditMode, message: 'Vui lòng chọn vai trò!' }]}>
                        <Select placeholder="Chọn vai trò">
                            <Select.Option value="renter">Người thuê</Select.Option>
                            <Select.Option value="landlord">Chủ nhà</Select.Option>
                            <Select.Option value="admin">Quản trị</Select.Option>
                        </Select>
                    </Form.Item>
                </Col>
                <Col span={24}>
                    <Form.Item name="address" label="Địa chỉ">
                        <Input/>
                    </Form.Item>
                </Col>
            </Row>
            <Form.Item className="text-right mt-4">
                <Space>
                    <Button onClick={onCancel} disabled={isLoading}>Hủy</Button>
                    <Button type="primary" htmlType="submit" loading={isLoading}>
                        {isEditMode ? 'Cập nhật' : 'Tạo mới'}
                    </Button>
                </Space>
            </Form.Item>
        </Form>
    );
};

export default UserForm;