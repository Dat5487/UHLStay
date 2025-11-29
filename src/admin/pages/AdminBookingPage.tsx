import React from 'react';
import {useQuery} from '@tanstack/react-query';
import {List, Card, Button, Avatar, Space, Skeleton, Typography, Divider, Empty} from 'antd';
import { useAppSelector } from '../../store/hooks';
import { selectCurrentUser, selectIsAuthenticated, selectIsInitialized } from '../../store/slices/authSlice';
import {useBookingMutations} from "../../hooks/useBookingMutations.ts";
import {fetchAllPendingBookings} from "../../services/bookingApi.ts";
import {Link} from "react-router-dom";
import type {PopulatedBooking} from "../../types";


const {Title, Paragraph} = Typography;

const AdminBookingPage: React.FC = () => {
    const user = useAppSelector(selectCurrentUser);
    const isAuthenticated = useAppSelector(selectIsAuthenticated);
    const isInitialized = useAppSelector(selectIsInitialized);
    const { approve, reject, isApproving, isRejecting } = useBookingMutations();

    const { data: requests } = useQuery({
        queryKey: ['adminPendingBookings'],
        queryFn: fetchAllPendingBookings,
        enabled: isInitialized && isAuthenticated && user?.role.name === 'admin',
    });

    if (!isInitialized) return <div className="p-8"><Skeleton active /></div>;
    // if (!isAuthenticated || user?.role.name !== 'admin') return <Result status="403" title="Không có quyền truy cập" />;

    return (
        <div className="p-4 md:p-8">
            <Title level={2} className="mb-6">Yêu cầu Đặt phòng mới ({requests?.length || 0})</Title>
            {!requests || requests.length === 0 ? (
                <Empty description="Không có yêu cầu đặt phòng mới nào." />
            ) : (
                <List
                    grid={{ gutter: 24, xs: 1, sm: 1, md: 2, lg: 3 }}
                    dataSource={requests}
                    renderItem={(item: PopulatedBooking) => (
                        <List.Item key={item.id}>
                            <Card>
                                <Card.Meta
                                    avatar={<Avatar src={item.tenant.avatar} size={50} />}
                                    title={<span className="font-semibold">Yêu cầu từ: {item.tenant.fullName}</span>}
                                    description={<Link to={`/motels/${item.motel.id}`} target="_blank">Phòng: {item.motel.title}</Link>}
                                />
                                <Divider />
                                <div className="text-sm">
                                    <Paragraph><strong>Chủ nhà:</strong> {item.owner.fullName}</Paragraph>
                                    <Paragraph><strong>Ngày đặt:</strong> {new Date(item.startDate).toLocaleDateString('vi-VN')} - {new Date(item.endDate).toLocaleDateString('vi-VN')}</Paragraph>
                                    <Paragraph><strong>Tiền cọc:</strong> <span className="font-bold text-green-600">{item.depositAmount.toLocaleString()} VNĐ</span></Paragraph>
                                </div>
                                <Space className="mt-4">
                                    <Button
                                        type="primary"
                                        onClick={() => approve(item.id)}
                                        loading={isApproving}
                                    >
                                        Chấp thuận
                                    </Button>
                                    <Button
                                        danger
                                        onClick={() => reject(item.id)}
                                        loading={isRejecting}
                                    >
                                        Từ chối
                                    </Button>
                                </Space>
                            </Card>
                        </List.Item>
                    )}
                />
            )}
        </div>
    );
};

export default AdminBookingPage;