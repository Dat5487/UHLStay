import {Link, useParams} from "react-router-dom";
import {useQuery} from "@tanstack/react-query";
import {fetchMotelById} from "../../services/motelApi.ts";
import {
    Breadcrumb,
    Button,
    Col,
    Divider,
    Row,
    Skeleton,
    Result
} from "antd";
import {HomeOutlined} from "@ant-design/icons";
import CommentsSection from "../../components/common/section/CommentSection.tsx";
import PinButton from "../../components/common/button/PinButton.tsx";
import MotelImageGallery from "../../components/motels/MotelImageGallary.tsx";
import MotelDetailsSidebar from "../../components/motels/details/MotelDetailsSidebar.tsx";
import RelatedContent from "../../components/motels/details/RelatedContent.tsx";
import {useAuth} from "../../hooks/useAuth.ts";
import {fetchBookingByUserAndMotel} from "../../services/bookingApi.ts";

const MotelDetailPage = () => {
    const params = useParams<{ motelId: string }>();
    const motelId = params.motelId ? params.motelId : undefined;

    const { user, isAuthenticated } = useAuth();

    const { data: existingBooking } = useQuery({
        queryKey: ['existingBooking', user?.id, motelId],
        queryFn: () => fetchBookingByUserAndMotel(user!.id, motelId!),
        enabled: isAuthenticated && !!motelId,
    });

    const { data: motel, isLoading, error } = useQuery({
        queryKey: ['motels', motelId],
        queryFn: () => fetchMotelById(motelId!),
        enabled: !!motelId,
    });


    if (isLoading) {
        return (
            <div className="max-w-6xl mx-auto p-4 md:p-8">
                <Skeleton active paragraph={{ rows: 2 }} className="max-w-md mb-8" />
                <Row gutter={[32, 32]}>
                    <Col xs={24} md={14}><Skeleton.Image active style={{ width: '100%', height: 400 }} /></Col>
                    <Col xs={24} md={10}><Skeleton active paragraph={{ rows: 8 }} /></Col>
                </Row>
            </div>
        );
    }

    if (error || !motel) {
        return (
            <Result
                status="404"
                title="Không tìm thấy phòng trọ"
                subTitle="Xin lỗi, phòng trọ bạn đang tìm kiếm không tồn tại hoặc đã bị xóa."
                extra={<Link to="/"><Button type="primary">Về trang chủ</Button></Link>}
                className="p-8"
            />
        );
    }

    return (
        <div className="max-w-6xl mx-auto p-4 md:p-8 bg-white">
            <Breadcrumb className="!mb-4 !text-xl">
                <Breadcrumb.Item><Link to="/"><HomeOutlined /></Link></Breadcrumb.Item>
                <Breadcrumb.Item>Phòng trọ</Breadcrumb.Item>
                <Breadcrumb.Item>{motel.title}</Breadcrumb.Item>
            </Breadcrumb>

            <Row gutter={[32, 32]}>
                {/* Cột trái */}
                <Col xs={24} md={14}>
                    <MotelImageGallery images={motel.images} />
                    <RelatedContent currentMotelId={motel.id}/>
                </Col>
                

                {/* Cột phải: Thông tin */}
                <Col xs={24} md={10}>
                    <MotelDetailsSidebar motel={motel} existingBooking={existingBooking}/>
                </Col>
            </Row>

            <Divider/>
            <div className="mt-6">
                <PinButton itemType="motels" itemId={motel.id} />
            </div>
            <CommentsSection resourceId={motel.id} />
        </div>
    );
}
export default MotelDetailPage;