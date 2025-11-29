
import {Space} from "antd";
import HeroSection from "../components/home/HeroSection.tsx";
import FeaturedRoomsSection from "../components/home/FeaturedRoomsSection.tsx";
import TestimonialsSection from "../components/home/TestimonialsSection.tsx";
import WhyChooseUsSection from "../components/home/WhyChooseUsSection.tsx";
import FaqSection from "../components/home/FaqSection.tsx";

const HomePage = () => {
    return (
        <div className="text-center mt-10">
            <Space direction="vertical" size="large" className="w-full">
                <HeroSection />
                <WhyChooseUsSection/>
                <FeaturedRoomsSection/>
                <TestimonialsSection/>
                <FaqSection/>
            </Space>
        </div>
    );
}

export default HomePage;