import {Button, Typography, Card, Row, Col, Tag, Space, Spin, Alert} from 'antd';
import {useQuery} from "@tanstack/react-query";
import {fetchFeaturedMotels} from "../../services/motelApi.ts";
import {useNavigate} from "react-router-dom";

const { Title, Paragraph } = Typography;
export default function FeaturedRoomsSection() {
    const navigate = useNavigate();
    const { data: featuredRooms, isLoading, error } = useQuery({
        queryKey: ['featured_motels'],
        queryFn: fetchFeaturedMotels,
    });

    const handleDirecting = (motelId: string) => {
        return navigate(`/motels/${motelId}`);
    }

    if (isLoading) {
        return (
            <div className="py-20 text-center">
                <Spin tip="Đang tải phòng trọ nổi bật..." size="large" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="container mx-auto px-4 py-12">
                <Alert message="Lỗi" description="Không thể tải dữ liệu phòng trọ." type="error" showIcon />
            </div>
        );
    }
    return (
        <div className="md:py-12 bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 rounded-lg border-4 border-teal-300">
            <div className="container mx-auto text-center px-4">
                <Title level={2} className="!text-3xl md:!text-4xl mb-4 text-text-main">Phòng trọ nổi bật</Title>
                <Paragraph className="!text-xl mb-12 text-text-light">
                    Những lựa chọn được yêu thích nhất, đã được xác thực và sẵn sàng chào đón bạn.
                </Paragraph>
                <Row gutter={[32, 32]} style={{ alignItems: 'stretch' }}>
                    {featuredRooms?.map(room => (
                        <Col xs={24} sm={12} md={8} key={room.id}>
                            <Card
                                hoverable
                                className="h-full flex flex-col justify-between"
                                style={{ height: '100%', display: 'flex', flexDirection: 'column' }}
                                cover={
                                    <div className="relative">
                                        <img 
                                            alt={room.title}
                                            src={room.images?.[0] || 'https://via.placeholder.com/400x300?text=No+Image'}
                                            className="h-48 md:h-56 w-full object-cover"
                                        />
                                        {room.images && room.images.length > 1 && (
                                            <div className="absolute top-2 right-2 bg-black bg-opacity-70 text-white px-2 py-1 rounded-full text-xs font-medium">
                                                +{room.images.length - 1} ảnh
                                            </div>
                                        )}
                                        {room.images && room.images.length > 1 && (
                                            <div className="absolute bottom-2 right-2 flex space-x-1">
                                                {room.images.slice(1, 3).map((image, index) => (
                                                    <img
                                                        key={index}
                                                        src={image}
                                                        alt={`Preview ${index + 2}`}
                                                        className="w-8 h-8 rounded object-cover border-2 border-white"
                                                    />
                                                ))}
                                                {room.images.length > 3 && (
                                                    <div className="w-8 h-8 rounded bg-black bg-opacity-70 text-white text-xs flex items-center justify-center border-2 border-white">
                                                        +{room.images.length - 3}
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                }
                            >
                                <div style={{ flexGrow: 1 }}>
                                    <Title level={5} className="overflow-hidden whitespace-nowrap text-ellipsis">
                                        {room.title}
                                    </Title>
                                    <Space wrap className="my-3">
                                        {room.amenities.slice(0, 2).map(amenity => (
                                            <Tag key={amenity}>
                                                {amenity}
                                            </Tag>
                                        ))}
                                    </Space>
                                    <Paragraph className="text-primary font-bold text-lg">
                                        {room.price?.value?.toLocaleString()} VNĐ/Tháng
                                    </Paragraph>
                                    <Button type="default" className="w-full" onClick={() => handleDirecting(room.id)}>Xem chi tiết</Button>
                                </div>
                            </Card>
                        </Col>
                    ))}
                </Row>
            </div>
        </div>
    );
}