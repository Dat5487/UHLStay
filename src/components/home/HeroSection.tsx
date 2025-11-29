import {Button, Typography, Space} from 'antd';
import {useNavigate} from 'react-router-dom';


const {Title, Paragraph} = Typography;

const videoUrl = "/videos/landing_page.mp4";

export default function HeroSection() {
    const navigate = useNavigate();

    return (
        <div className="relative w-full h-[70vh] sm:h-[80vh] lg:h-screen flex items-center justify-center text-center overflow-hidden bg-black">
            <video
                className="absolute top-0 left-0 w-full h-full lg:min-h-screen object-cover z-10 pointer-events-none opacity-65"
                src={videoUrl}
                autoPlay
                loop
                muted
                playsInline
            />
            <div className="absolute top-0 left-0 w-full h-full lg:min-h-screen bg-black/60 z-20"></div>
            <div className="relative z-30 px-4">
                <Title level={1} className="text-4xl md:text-5xl lg:text-6xl !font-extrabold !text-white leading-tight">
                    Chạm nhẹ là có nhà
                </Title>

                <Paragraph className="!text-base md:!text-lg lg:!text-xl my-4 md:my-6 !text-gray-200 max-w-3xl mx-auto">
                    Nền tảng của chúng tôi cung cấp mọi công cụ bạn cần để biến ý tưởng thành hiện thực một cách nhanh
                    chóng và hiệu quả. <br/>
                    <span className={"font-bold"}>Bắt đầu chọn cho mình căn nhà trọ tốt nhất ngay hôm nay!</span>
                </Paragraph>

                <Space wrap size="large" className="mt-8 justify-center">
                    <Button
                        type="primary"
                        size="large"
                        className="!w-full sm:!w-[260px] !h-12 sm:!h-14 !text-base sm:!text-lg"
                        onClick={() => navigate('/motels')}
                    >
                        Khám phá ngay
                    </Button>
                </Space>
            </div>
        </div>
    );
};