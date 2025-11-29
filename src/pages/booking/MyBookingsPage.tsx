import React from 'react';
import {useQuery} from '@tanstack/react-query';
import {List, Card, Button, Tag, Space, Skeleton, Empty} from 'antd';
import {Link} from 'react-router-dom';
import type {PopulatedBooking} from "../../types";
import {useAppSelector} from '../../store/hooks';
import {selectCurrentUser, selectIsInitialized} from '../../store/slices/authSlice';
import {useBookingMutations} from "../../hooks/useBookingMutations.ts";
import {fetchMyBookings} from "../../services/bookingApi.ts";


const getStatusTag = (status: PopulatedBooking['status']) => {
    const colorMap: { [key: string]: string } = {
        PENDING_APPROVAL: 'gold',
        APPROVED_PENDING_DEPOSIT: 'processing',
        CONFIRMED: 'success',
        REJECTED: 'error',
        CANCELLED: 'default',
    };
    const textMap: { [key: string]: string } = {
        PENDING_APPROVAL: 'Chờ xác nhận',
        APPROVED_PENDING_DEPOSIT: 'Chờ đặt cọc',
        CONFIRMED: 'Đã xác nhận',
        REJECTED: 'Bị từ chối',
        CANCELLED: 'Đã hủy',
    };
    return <Tag color={colorMap[status]}>{textMap[status] || status}</Tag>;
};

const MyBookingsPage: React.FC = () => {
    const user = useAppSelector(selectCurrentUser);
    const isInitialized = useAppSelector(selectIsInitialized);
    const {cancel, confirmDeposit, isCancelling, isConfirming} = useBookingMutations();

    const {data: bookings, isLoading} = useQuery({
        queryKey: ['myBookings', user?.id],
        queryFn: () => fetchMyBookings(user!.id),
        enabled: !!user,
    });

    if (!isInitialized) return <div className="p-8"><Skeleton active/></div>;

    if (isLoading) {
        return (
            <div className="max-w-4xl mx-auto p-4 md:p-8">
                <Skeleton active paragraph={{rows: 8}}/>
            </div>
        );
    }

    if (!bookings || bookings.length === 0) {
        return (
            <div className="max-w-4xl mx-auto p-4 md:p-8">
                <Empty description="Bạn chưa có yêu cầu đặt phòng nào."/>
            </div>
        )
    }

    return (
        <div className="max-w-4xl mx-auto p-4 md:p-8">
            <h1 className="text-3xl font-bold mb-6">Lịch sử Đặt phòng của tôi</h1>
            <List
                itemLayout="vertical"
                dataSource={bookings}
                renderItem={item => (
                    <List.Item key={item.id}>
                        <Card>
                            <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                                <div>
                                    <Link to={`/motels/${item.motel.id}`}
                                          className="text-lg font-semibold hover:underline">{item.motel.title}</Link>
                                    <p className="text-gray-500 mt-1">
                                        Ngày: {new Date(item.startDate).toLocaleDateString('vi-VN')} - {new Date(item.endDate).toLocaleDateString('vi-VN')}
                                    </p>
                                    <p>Tổng tiền: <span
                                        className="font-bold">{item.depositAmount.toLocaleString()} VNĐ</span></p>
                                </div>
                                <div className="text-left sm:text-right flex-shrink-0">
                                    {getStatusTag(item.status)}
                                    <Space direction="vertical" className="mt-4 w-full">
                                        {item.status === 'PENDING_APPROVAL' && (
                                            <Button danger size="small" block onClick={() => cancel(item.id)}
                                                    loading={isCancelling}>
                                                Hủy yêu cầu
                                            </Button>
                                        )}
                                        {item.status === 'APPROVED_PENDING_DEPOSIT' && (
                                            <>
                                                <Button
                                                    type="primary"
                                                    size="small"
                                                    block
                                                    onClick={() => confirmDeposit({
                                                        bookingId: item.id,
                                                        amount: item.depositAmount
                                                    })}
                                                    loading={isConfirming}
                                                >
                                                    Thanh toán Cọc
                                                </Button>
                                                <Button
                                                    danger
                                                    size="small"
                                                    block
                                                    onClick={() => cancel(item.id)}
                                                    loading={isCancelling}
                                                >
                                                    Hủy
                                                </Button>
                                            </>
                                        )}
                                    </Space>
                                </div>
                            </div>
                        </Card>
                    </List.Item>
                )}
            />
        </div>
    );
};

export default MyBookingsPage;