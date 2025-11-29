import {Typography} from 'antd';
import {
    SafetyCertificateOutlined,
    SlidersOutlined,
    CameraOutlined,
    FileProtectOutlined
} from '@ant-design/icons';

const {Title, Paragraph} = Typography;

// Dữ liệu cho các tính năng/lợi ích
const features = [
    {
        icon: <SafetyCertificateOutlined className="text-4xl text-primary"/>,
        title: 'Phòng Trọ Xác Thực 100%',
        description: 'Tất cả các tin đăng đều được đội ngũ chúng tôi kiểm duyệt và xác thực thông tin, hình ảnh để đảm bảo an toàn tuyệt đối cho bạn.'
    },
    {
        icon: <SlidersOutlined className="text-4xl text-primary"/>,
        title: 'Bộ Lọc Tìm Kiếm Thông Minh',
        description: 'Dễ dàng tìm kiếm theo giá, diện tích, tiện ích, và khoảng cách tới trường học của bạn chỉ với vài cú nhấp chuột.'
    },
    {
        icon: <CameraOutlined className="text-4xl text-primary"/>,
        title: 'Tham Quan Phòng 360°',
        description: 'Trải nghiệm không gian phòng trọ một cách chân thực nhất ngay trên máy tính hoặc điện thoại của bạn trước khi quyết định.'
    },
    {
        icon: <FileProtectOutlined className="text-4xl text-primary"/>,
        title: 'Hợp Đồng Điện Tử An Toàn',
        description: 'Tạo và ký hợp đồng thuê nhà trực tuyến một cách an toàn, minh bạch và có giá trị pháp lý, giúp bạn tiết kiệm thời gian.'
    }
];

export default function WhyChooseUsSection() {
    return (
        <div className="md:py-20 py-16 bg-gradient-to-br from-blue-50 via-white to-blue-50 relative overflow-hidden ">
            {/* Decorative background elements */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-blue-100 rounded-full blur-3xl opacity-30 -translate-y-1/2 translate-x-1/2"></div>
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-cyan-100 rounded-full blur-3xl opacity-30 translate-y-1/2 -translate-x-1/2"></div>
            
            <div className="container mx-auto px-4 text-center relative z-10">
                <Title level={2} className="mb-4 text-gray-800 font-bold">Tại sao chọn UniStay?</Title>
                <Paragraph className="!text-xl mb-16 text-gray-600 max-w-3xl mx-auto leading-relaxed">
                    Chúng tôi không chỉ giúp bạn tìm phòng. Chúng tôi mang đến một trải nghiệm thuê trọ an toàn, tiện
                    lợi và thông minh.
                </Paragraph>

                {/* Lưới hiển thị các tính năng */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {features.map((feature, index) => (
                        <div 
                            key={index} 
                            className="text-center p-8 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border border-gray-100"
                        >
                            <div className="mb-6 flex justify-center">
                                <div className="p-4 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-2xl">
                                    {feature.icon}
                                </div>
                            </div>
                            <Title level={4} className="mb-3 !text-xl !text-gray-800 font-semibold">{feature.title}</Title>
                            <Paragraph className="text-gray-600 !text-base leading-relaxed">
                                {feature.description}
                            </Paragraph>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}