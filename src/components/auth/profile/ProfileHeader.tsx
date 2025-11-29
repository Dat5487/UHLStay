import type {User} from "../../../types";
import {Avatar, Button, Typography} from "antd";
import {EditOutlined, UserOutlined} from "@ant-design/icons";

const { Title, Text } = Typography;

interface ProfileHeaderProps {
    user: User;
    isEditing: boolean;
    onEditToggle: () => void;
}

const ProfileHeader = ({ user, isEditing, onEditToggle }: ProfileHeaderProps) => {
    return (
        <div className="flex flex-col items-center text-center md:flex-row md:text-left md:items-start gap-6 mb-8">
            <Avatar size={128} src={user.avatar} icon={<UserOutlined />} />
            <div className="flex-grow">
                <Title level={2} className="mt-0 mb-1">{user.fullName}</Title>
                <Text type="secondary" className="capitalize text-base">{user.role.name}</Text>
                <p className="text-gray-500 mt-2">{user.email}</p>
                <Button
                    type="primary"
                    ghost
                    onClick={onEditToggle}
                    className="mt-4"
                    icon={<EditOutlined />}
                >
                    {isEditing ? 'Hủy bỏ' : 'Chỉnh sửa thông tin'}
                </Button>
            </div>
        </div>
    );
};

export default ProfileHeader;