import type {Motel, PopulatedBooking} from "../../../types";
import {Avatar, Button, Col, Divider, Row, Typography} from "antd";
import {
    ArrowsAltOutlined,
    CheckCircleFilled,
    HomeOutlined,
    MessageOutlined, UserOutlined,
} from "@ant-design/icons";
import {useNavigate} from "react-router-dom";
import React from "react";
import MotelLocationMap from "./MotelLocationMap";


const { Title, Text } = Typography;

interface MotelDetailsSidebarProps {
    motel: Motel;
    existingBooking?: PopulatedBooking | null;
}

const DetailItem: React.FC<{ icon: React.ReactNode; text: React.ReactNode }> = ({ icon, text }) => (
    <div className="flex items-start text-black">
        <span className="mt-1 mr-3 !text-black">{icon}</span>
        <span>{text}</span>
    </div>
);

const PropertyDetailsSidebar: React.FC<MotelDetailsSidebarProps> = ({ motel, existingBooking }) => {
    const navigate = useNavigate();
    return (
        <div className="p-6  rounded-lg sticky top-8">
            {/* Giá tiền */}
            <Title level={2} className="!text-green-500 !font-bold !mb-4">
                {motel.price.value.toLocaleString('vi-VN')} VNĐ
                <span className="!text-black text-lg"> / {motel.price.value}</span>
            </Title>

            {/* Thông tin chi tiết (Địa chỉ, diện tích...) */}
            <div className="space-y-3 mb-3">
                <DetailItem icon={<HomeOutlined />} text={motel.city + ', ' + motel.district} />
                <DetailItem icon={<ArrowsAltOutlined />} text={`${motel.area} m²`} />
                <DetailItem icon={<UserOutlined />} text={`Tối đa ${motel.specs.capacity} người`} />
            </div>

            {/* Bản đồ nhỏ vị trí */}
            <MotelLocationMap city={motel.city} district={motel.district} className="mb-4" height={180} />

            <Divider className="!bg-black" />

            {/* Tiện ích nổi bật (layout 2 cột) */}
            <Title level={5} className="!text-black mb-4">Nổi bật</Title>
            <Row gutter={[16, 12]}>
                {motel.amenities.map(amenity => (
                    <Col span={12} key={amenity}>
                        <div className="flex items-center space-x-2">
                            <CheckCircleFilled className="text-green-500" />
                            <Text className="!text-black">{amenity}</Text>
                        </div>
                    </Col>
                ))}
            </Row>

            <Divider className="!bg-gray-700" />

            {/* Thông tin liên hệ (thêm Avatar) */}
            <Title level={5} className="!text-black mb-3">Thông tin liên hệ</Title>
            <div className="flex items-center space-x-3 mb-4">
                <Avatar src={motel.owner.avatar} size={48} />
                <div>
                    {/*<Text strong className="block !text-white">{motel.}</Text>*/}
                    <Text className="!text-black text-xs">Chủ nhà</Text>
                </div>
            </div>
            <div className="flex flex-col !space-y-3">
                {existingBooking ? (
                    <Button
                        type="primary"
                        size="large"
                        block
                        onClick={() => navigate(`/my-bookings`)}
                        className="!bg-orange-600 !hover:bg-orange-700 !text-black !border-none !font-semibold"
                    >
                        Xem chi tiết Đặt phòng
                    </Button>
                ) : (
                    <Button
                        type="primary"
                        size="large"
                        block
                        onClick={() => navigate(`/booking/${motel.id}`)}
                        className="!bg-green-600 !hover:bg-green-700 !text-black !border-none !font-semibold"
                    >
                        Gửi yêu cầu Đặt phòng
                    </Button>
                )}
                <Button size="large" icon={<MessageOutlined />} block className="!bg-blue-600 !hover:bg-blue-700 !text-black !border-none !font-semibold">
                    Chat Zalo
                </Button>
            </div>
        </div>
    );
}
export default PropertyDetailsSidebar;