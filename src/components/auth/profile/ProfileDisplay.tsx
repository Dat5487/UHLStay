import {Descriptions, Tag, Typography} from "antd";
import type {User} from "../../../types";

const { Title } = Typography;

interface ProfileDisplayProps {
    user: User;
}

const ProfileDisplay = ({ user }: ProfileDisplayProps) => {
    return (
        <div>
            <Title level={4}>Thông tin chi tiết</Title>
            <Descriptions bordered column={1}>
                <Descriptions.Item label="Họ và Tên">{user.fullName}</Descriptions.Item>
                <Descriptions.Item label="Email">{user.email}</Descriptions.Item>
                <Descriptions.Item label="Số điện thoại">{user.phoneNumber || 'Chưa cập nhật'}</Descriptions.Item>
                <Descriptions.Item label="Tuổi">{user.age || 'Chưa cập nhật'}</Descriptions.Item>
                <Descriptions.Item label="Giới tính">{user.gender || 'Chưa cập nhật'}</Descriptions.Item>
                <Descriptions.Item label="Địa chỉ">{user.address || 'Chưa cập nhật'}</Descriptions.Item>
                <Descriptions.Item label="Vai trò">
                    <Tag color={"blue"}>{user.role.name.toUpperCase()}</Tag>
                </Descriptions.Item>
            </Descriptions>
        </div>
    );
};

export default ProfileDisplay;