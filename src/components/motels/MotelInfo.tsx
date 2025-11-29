// src/components/motel/MotelInfo.tsx
import React from 'react';
import { Typography, Tag, Divider } from 'antd';
import type { Motel } from '../../types'; // Giả định bạn có type Motel

const { Title, Text, Paragraph } = Typography;

interface MotelInfoProps {
    motel: Motel;
}

const MotelInfo: React.FC<MotelInfoProps> = ({ motel }) => (
    <div>
        <Title level={2} className="!mb-2">{motel.title}</Title>
        <Text type="secondary">{motel.district}, {motel.city}</Text>

        <Title level={3} className="!text-red-600 !mt-4">
            {motel.price.value.toLocaleString('vi-VN')} VNĐ/tháng
        </Title>

        <div className="flex items-center space-x-4 text-base">
            <Text strong>Diện tích:</Text>
            <span>{motel.area} m²</span>
        </div>

        <Divider />

        <Title level={5}>Mô tả chi tiết</Title>
        <Paragraph>{motel.description}</Paragraph>

        <Title level={5} className="mt-4">Tiện nghi</Title>
        <div className="flex flex-wrap gap-2">
            {motel.amenities.map(amenity => (
                <Tag key={amenity} color="blue">{amenity}</Tag>
            ))}
        </div>
    </div>
);

export default MotelInfo;