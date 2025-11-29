import React, {useState} from 'react';
import {useQuery} from '@tanstack/react-query';
import {List, Card, Button, Avatar, Space, Skeleton, Empty, Typography, Result, Divider} from 'antd';
import {Link} from 'react-router-dom';
import {useAuth} from "../../hooks/useAuth.ts";
import {fetchPendingMotels} from "../../services/motelApi.ts";
import {useMotelMutations} from "../../hooks/useMotelMutations.ts";
import type {Motel} from "../../types";
import MotelDetailForm from "../components/motels/MotelDetailForm.tsx";


const {Title, Paragraph} = Typography;

const AdminApprovalPage: React.FC = () => {
    const {user: admin, isAuthenticated, isLoadingUser} = useAuth();

    const {approveMotel, rejectMotel, isLoading: isMutating} = useMotelMutations();

    const {data: pendingMotels, isLoading: isLoadingMotels} = useQuery({
        queryKey: ['pendingMotels'],
        queryFn: fetchPendingMotels,
        enabled: isAuthenticated && admin?.role.name === 'admin',
    });

    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedMotelId, setSelectedMotelId] = useState<string | null>(null);

    const handleViewDetails = (motelId: string) => {
        setSelectedMotelId(motelId);
        setIsModalVisible(true);
    };

    const handleCloseModal = () => {
        setIsModalVisible(false);
        setSelectedMotelId(null);
    };


    if (isLoadingUser) {
        return <div className="p-8"><Skeleton active/></div>;
    }

    if (!isAuthenticated || admin?.role.name === 'renter') {
        return (
            <Result
                status="403"
                title="403 - Access Denied"
                subTitle="Bạn không có quyền truy cập vào trang này."
                extra={<Link to="/"><Button type="primary">Về trang chủ</Button></Link>}
            />
        );
    }

    if (isLoadingMotels) {
        return (
            <div className="max-w-5xl mx-auto p-4 md:p-8">
                <Title level={2} className="mb-6">Đang tải danh sách chờ duyệt...</Title>
                <Skeleton active paragraph={{rows: 6}}/>
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto p-4 md:p-8">
            <Title level={2} className="mb-6">
                Danh sách Tin đăng chờ
                duyệt {pendingMotels && pendingMotels.length > 0 ? `(${pendingMotels.length})` : ''}
            </Title>

            {!pendingMotels || pendingMotels.length === 0 ? (
                <Empty description="Không có tin đăng nào cần phê duyệt."/>
            ) : (
                <>
                    <List
                        itemLayout="vertical"
                        dataSource={pendingMotels}
                        renderItem={(motel: Motel) => (
                            <List.Item key={motel.id}>
                                <Card>
                                    <div className="flex flex-col md:flex-row gap-6">
                                        <img
                                            src={motel.images[0]}
                                            alt={motel.title}
                                            className="w-full md:w-64 h-48 object-cover rounded-md"/>
                                        <div className="flex-1">
                                            <Title level={4}>{motel.title}</Title>
                                            <Paragraph type="secondary">
                                                Đăng bởi: <Avatar size="small"
                                                                  src={motel.owner.avatar}/> {motel.owner.fullName}
                                            </Paragraph>
                                            <Paragraph>
                                                <strong>Giá:</strong> {motel.price.value.toLocaleString()} VNĐ
                                                | <strong>Diện
                                                tích:</strong> {motel.area} m²
                                            </Paragraph>
                                            <Divider/>
                                            <Space>
                                                <Button type="primary" onClick={() => approveMotel(motel.id)}
                                                        loading={isMutating}>
                                                    Duyệt
                                                </Button>
                                                <Button danger onClick={() => rejectMotel(motel.id)}
                                                        loading={isMutating}>
                                                    Từ chối
                                                </Button>
                                                <Button onClick={() => handleViewDetails(motel.id)}>
                                                    Xem chi tiết
                                                </Button>
                                            </Space>
                                        </div>
                                    </div>
                                </Card>
                            </List.Item>
                        )}
                    />
                    <MotelDetailForm
                        motelId={selectedMotelId}
                        open={isModalVisible}
                        onClose={handleCloseModal}
                    />
                </>
            )}
        </div>
    );
};

export default AdminApprovalPage;