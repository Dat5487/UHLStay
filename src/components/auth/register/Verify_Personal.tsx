import {Form, type FormInstance, Input} from "antd";
import type {RegisterFormData} from "../../../types";

interface StepProps {
    form: FormInstance<RegisterFormData>;
}
const Verify_Personal = ({form}: StepProps) => {
    return (
        <Form form={form} layout="vertical" size="large">
            <Form.Item
                name="fullName"
                label="Họ và Tên"
                rules={[{ required: true, message: 'Vui lòng nhập họ tên!' }]}
            >
                <Input />
            </Form.Item>
            <Form.Item
                name="phoneNumber"
                label="Số điện thoại (Tùy chọn)"
            >
                <Input />
            </Form.Item>
        </Form>
    );
};
export default Verify_Personal;