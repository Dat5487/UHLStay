// 1. Import thêm component Rate từ antd
import { Typography, Card, Row, Col, Avatar, Rate } from 'antd';
import { UserOutlined } from '@ant-design/icons';

const { Title, Paragraph } = Typography;

// 2. Thêm trường "rating" vào dữ liệu
const testimonials = [
    {
        name: 'Nguyễn Thu Trang',
        role: 'Sinh viên năm 2, ĐH Hạ Long',
        avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704d',
        comment: '"Tìm phòng qua website rất nhanh. Mình tìm được phòng ưng ý chỉ sau 2 ngày, chủ nhà lại thân thiện. Rất khuyến khích các bạn dùng thử!"',
        rating: 5,
    },
    {
        name: 'Trần Minh Hoàng',
        role: 'Sinh viên năm 4, ĐH Ngoại thương - Cơ sở Quảng Ninh',
        avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026705d',
        comment: '"Các phòng trên này đều được xác thực nên mình rất yên tâm. Không còn lo bị lừa như khi tìm trên các group facebook nữa. 5 sao!"',
        rating: 5,
    },
    {
        name: 'Lê Thị Mai Anh',
        role: 'Tân sinh viên, ĐH Ngoại Thương - Cơ sở Quảng Ninh',
        avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026706d',
        comment: '"Giao diện dễ dùng, tuy nhiên app đôi lúc còn hơi chậm. Mong team sẽ cải thiện. Về chất lượng phòng thì rất tốt."',
        rating: 4.5, // AntD Rate hỗ trợ cả nửa sao
    },
];

export default function TestimonialsSection() {
    return (
        <div className="py-8 md:py-20 bg-yellow-300">
            <div className="container mx-auto text-center px-4">
                <Title level={2} className="!text-3xl md:!text-4xl mb-4 text-text-main">Các đánh giá từ cộng đồng</Title>
                <Paragraph className="!text-lg mb-12 text-text-light">
                    Sự hài lòng của bạn là động lực lớn nhất của chúng tôi.
                </Paragraph>
                <Row gutter={[32, 32]}>
                    {testimonials.map(item => (
                        <Col xs={24} md={8} key={item.name}>
                            <Card className="h-full text-left flex flex-col justify-around">
                                <div className="flex-grow">
                                    {/* 3. Thêm component Rate vào đây */}
                                    <Rate disabled allowHalf defaultValue={item.rating} />

                                    <Paragraph italic className="text-text-light text-base mt-4">
                                        {item.comment}
                                    </Paragraph>
                                </div>
                                <div className="flex items-center mt-6">
                                    <Avatar 
                                        src={item.avatar} 
                                        icon={<UserOutlined />}
                                        className="!w-10 !h-10 sm:!w-12 sm:!h-12 md:!w-14 md:!h-14 flex-shrink-0"
                                    />
                                    <div className="ml-3 sm:ml-4">
                                        <Title level={5} className="m-0 text-sm sm:text-base">{item.name}</Title>
                                        <Paragraph className="m-0 text-text-light text-xs sm:text-sm">{item.role}</Paragraph>
                                    </div>
                                </div>
                            </Card>
                        </Col>
                    ))}
                </Row>
            </div>
        </div>
    );
}