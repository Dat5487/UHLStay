import { Card, Typography, Tag } from 'antd';
import { Link } from 'react-router-dom';
import type { DisplayCardData } from '../../../types';

const { Title, Text } = Typography;

const UnifiedCard = ({ item }: { item: DisplayCardData }) => {
    const tagColor =
        item.type === 'Phòng trọ' ? 'blue'
            : item.type === 'Đồ cũ' ? 'green'
                : 'purple';

    return (
        <Link to={item.link}>
            <Card
                hoverable
                cover={<img alt={item.title} src={item.imageUrl} className="h-48 w-full object-cover" />}
                bodyStyle={{ padding: '16px' }}
            >
                <Tag color={tagColor} style={{ marginBottom: '8px' }}>{item.type}</Tag>
                <Title level={5} className="truncate whitespace-normal h-12 m-0">
                    {item.title}
                </Title>
                <Text strong className="text-lg text-red-500 block mt-2">
                    {item.price > 0 ? `${item.price.toLocaleString()}đ` : 'Miễn phí'}
                </Text>
                <Text type="secondary" className="text-xs truncate block mt-1">
                    {item.subInfo}
                </Text>
            </Card>
        </Link>
    );
};

export default UnifiedCard;