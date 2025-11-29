import { Collapse, Typography } from 'antd';
import {DownOutlined, UpOutlined} from "@ant-design/icons";
const { Title, Paragraph } = Typography;

// Nội dung cho các câu hỏi và câu trả lời
const faqData = [
    {
        key: '1',
        label: 'Làm thế nào để đặt phòng trên UniStay?',
        children: <Paragraph>Bạn chỉ cần tìm kiếm phòng trọ ưng ý, xem chi tiết và nhấn nút "Đặt ngay". Chúng tôi sẽ hướng dẫn bạn các bước tiếp theo để liên hệ với chủ nhà và hoàn tất thủ tục một cách an toàn.</Paragraph>,
    },
    {
        key: '2',
        label: 'Thông tin và hình ảnh phòng trọ có đáng tin cậy không?',
        children: <Paragraph>Chắc chắn rồi! Mỗi tin đăng trên nền tảng của chúng tôi đều phải trải qua bước kiểm duyệt và được gắn nhãn "Đã xác thực" nếu thông tin chính xác, giúp bạn hoàn toàn yên tâm.</Paragraph>,
    },
    {
        key: '3',
        label: 'Tôi có phải trả thêm bất kỳ khoản phí nào cho UniStay không?',
        children: <Paragraph>Chúng tôi cam kết không thu bất kỳ khoản phí nào từ người đi thuê. Bạn chỉ cần thanh toán tiền thuê và các chi phí khác theo thỏa thuận trực tiếp với chủ nhà.</Paragraph>,
    },
    {
        key: '4',
        label: 'Làm sao để liên hệ trực tiếp với chủ nhà?',
        children: <Paragraph>Sau khi gửi yêu cầu đặt phòng, thông tin liên hệ của chủ nhà (số điện thoại, Zalo) sẽ được cung cấp để bạn có thể trao đổi chi tiết hơn về các điều khoản và lịch xem phòng.</Paragraph>,
    },
];

export default function FaqSection() {
    return (
        <div className="py-12 md:py-20 bg-white">
            <div className="container mx-auto px-4">
                <div className="text-center mb-12">
                    <Title level={2} className="!text-3xl md:!text-4xl text-text-main">Câu hỏi thường gặp</Title>
                    <Paragraph className="!text-lg text-text-light">
                        Những thắc mắc phổ biến nhất mà chúng tôi thường nhận được.
                    </Paragraph>
                </div>

                <div className="max-w-3xl mx-auto">
                    <Collapse
                        items={faqData}
                        bordered={false}
                        defaultActiveKey={['1']} // Tự động mở câu hỏi đầu tiên
                        className="bg-white !text-base md:!text-lg"
                        expandIcon={({ isActive }) =>
                            isActive ? <DownOutlined /> : <UpOutlined />
                        }
                    />
                </div>
            </div>
        </div>
    );
}