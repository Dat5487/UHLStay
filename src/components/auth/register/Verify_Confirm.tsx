import type {RegisterFormData} from "../../../types";
import {Typography} from "antd";
const { Title, Paragraph, Text } = Typography;

interface StepProps {
    formData: Partial<RegisterFormData>;
}

const Verify_Confirm = ({formData}: StepProps)  => {
    return (
        <div className="text-base">
            <Title level={4}>Xác nhận thông tin</Title>
            <p><Text strong>Email:</Text> {formData.email}</p>
            <p><Text strong>Họ và Tên:</Text> {formData.fullName}</p>
            <p><Text strong>Số điện thoại:</Text> {formData.phoneNumber || 'Không cung cấp'}</p>
            <Paragraph type="secondary" className="mt-4">
                Vui lòng kiểm tra lại thông tin trước khi hoàn tất đăng ký.
            </Paragraph>
        </div>
    );
};
export default Verify_Confirm;