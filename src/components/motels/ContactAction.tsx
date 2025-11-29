import {Button, Divider, Space} from 'antd';
import { MessageOutlined, PhoneOutlined } from '@ant-design/icons';

interface ContactActionsProps {
    phoneNumber: string;
    zaloNumber?: string;
}

const ContactAction = ({ phoneNumber, zaloNumber } : ContactActionsProps) => (
    <>
        <Divider />
        <Space wrap size="large" className="mt-4 justify-start">
            <Button
                type="primary"
                size="large"
                icon={<PhoneOutlined />}
                href={`tel:${phoneNumber}`}
            >
                Gọi {phoneNumber}
            </Button>
            <Button
                size="large"
                icon={<MessageOutlined />}
                href={`https://zalo.me/${zaloNumber || phoneNumber}`}
                target="_blank"
            >
                Nhắn tin Zalo
            </Button>
        </Space>
    </>
);

export default ContactAction;