import {useQuery} from "@tanstack/react-query";
import {Link, useParams} from "react-router-dom";
import {Alert, Avatar, Breadcrumb, Button, Col, Divider, Image, Row, Spin, Tag, Typography} from "antd";
import {HomeOutlined, MessageOutlined, PhoneOutlined} from "@ant-design/icons";
import {fetchItemById} from "../../services/marketApi.ts";
import PinButton from "../../components/common/button/PinButton.tsx";

const { Title, Text, Paragraph } = Typography;

const ItemDetailPage = () => {
    const params = useParams<{ itemId: string }>();
    const itemId = params.itemId ? params.itemId : undefined;
    const { data: item, isLoading, error } = useQuery({
        queryKey: ['items', itemId],
        queryFn: () => fetchItemById(itemId!),
        enabled: !!itemId,
    });
    if (isLoading) {
        return <div className="flex justify-center items-center h-screen"><Spin size="large" /></div>;
    }

    if (error || !item) {
        return <Alert message="Lỗi hoặc không tìm thấy sản phẩm" type="error" showIcon className="m-8" />;
    }
    return (
        <div className="max-w-6xl mx-auto p-4 md:p-8 bg-gray-50">
            <Breadcrumb className="mb-6">
                <Breadcrumb.Item><Link to="/items"><HomeOutlined /></Link></Breadcrumb.Item>
                <Breadcrumb.Item>Sản phẩm</Breadcrumb.Item>
                <Breadcrumb.Item>{item.title}</Breadcrumb.Item>
            </Breadcrumb>

            <div className="p-8 bg-white rounded-lg shadow-sm">
                <Row gutter={[32, 48]}>
                    {/* Cột trái: Hình ảnh */}
                    <Col xs={24} md={14}>
                        {/* Image Gallery */}
                        {item.images && item.images.length > 0 ? (
                            <div>
                                {/* Main large image */}
                                <Image.PreviewGroup>
                                    <div className="mb-4">
                                        <Image
                                            width="100%"
                                            src={item.images[0]}
                                            className="rounded-lg border"
                                            alt={item.title}
                                        />
                                    </div>
                                    
                                    {/* Thumbnail grid for additional images */}
                                    {item.images.length > 1 && (
                                        <div className="grid grid-cols-4 gap-2">
                                            {item.images.slice(1).map((image, index) => (
                                                <Image
                                                    key={index + 1}
                                                    width="100%"
                                                    height={120}
                                                    src={image}
                                                    className="rounded-lg object-cover cursor-pointer"
                                                    alt={`${item.title} - Ảnh ${index + 2}`}
                                                />
                                            ))}
                                        </div>
                                    )}
                                </Image.PreviewGroup>
                            </div>
                        ) : (
                            <Image
                                width="100%"
                                src="https://via.placeholder.com/800x600?text=No+Image"
                                className="rounded-lg border"
                                alt="No image available"
                            />
                        )}
                    </Col>

                    {/* Cột phải: Thông tin */}
                    <Col xs={24} md={10}>
                        <Title level={2} className="!mb-2">{item.title}</Title>

                        {item.listingType === 'free' ? (
                            <Title level={3}><Tag color="green" className="text-2xl py-1">MIỄN PHÍ</Tag></Title>
                        ) : (
                            <Title level={3} className="text-red-600">{item.price.toLocaleString()} VNĐ</Title>
                        )}

                        <Paragraph className="text-gray-600 mt-4">{item.description}</Paragraph>

                        <Divider />

                        <div className="space-y-3 text-base">
                            <div><Text strong className="w-24 inline-block">Danh mục:</Text> <Tag color="blue">{item.category}</Tag></div>
                            <div><Text strong className="w-24 inline-block">Tình trạng:</Text> <Tag>{item.condition === 'like_new' ? 'Như mới' : 'Đã dùng'}</Tag></div>
                            <div><Text strong className="w-24 inline-block">Khu vực:</Text> <Text>Tòa {item.location.building}</Text></div>
                            <div><Text strong className="w-24 inline-block">Ngày đăng:</Text> <Text>{new Date(item.createdAt).toLocaleDateString('vi-VN')}</Text></div>
                        </div>

                        <Divider />

                        <div className="p-4 bg-slate-50 rounded-lg border">
                            <Text strong>Người bán</Text>
                            <div className="flex items-center mt-2">
                                <Avatar src={item.seller.avatar} size="large" />
                                <Text strong className="ml-3 text-lg">{item.seller.name}</Text>
                            </div>
                        </div>

                        <div className="mt-6 flex flex-col sm:flex-row gap-3 sm:gap-4 w-full">
                            <Button 
                                type="primary" 
                                size="large" 
                                icon={<PhoneOutlined />}
                                className="w-full sm:w-auto"
                            >
                                Liên hệ ngay
                            </Button>
                            <Button 
                                size="large" 
                                icon={<MessageOutlined />}
                                className="w-full sm:w-auto"
                            >
                                Nhắn tin
                            </Button>
                        </div>
                    </Col>
                </Row>
            </div>
            <div className="mt-6">
                <PinButton itemType="items" itemId={item.id} />
            </div>
        </div>
    );
}
export default ItemDetailPage;