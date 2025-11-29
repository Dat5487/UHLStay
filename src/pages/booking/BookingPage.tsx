import React, { useEffect, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
    Row,
    Col,
    DatePicker,
    Form,
    Input,
    Button,
    Card,
    Typography,
    Divider,
    Skeleton,
    Result,
    notification,
    InputNumber,
} from 'antd';
import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';
import { useAppSelector } from '../../store/hooks';
import { selectCurrentUser, selectIsAuthenticated, selectIsInitialized } from '../../store/slices/authSlice';
import {useBookingMutations} from "../../hooks/useBookingMutations.ts";
import {fetchMotelById} from "../../services/motelApi.ts";
import type {Booking} from "../../types";

const { Title, Text, Paragraph } = Typography;
const { RangePicker } = DatePicker;

const BookingPage: React.FC = () => {
    const { motelId } = useParams<{ motelId: string }>();
    const [form] = Form.useForm();
    const navigate = useNavigate();

    const user = useAppSelector(selectCurrentUser);
    const isAuthenticated = useAppSelector(selectIsAuthenticated);
    const isInitialized = useAppSelector(selectIsInitialized);
    const { createBookingAsync, isCreating } = useBookingMutations();

    const { data: motel, isLoading: isLoadingMotel, isError } = useQuery({
        queryKey: ['motel', motelId],
        queryFn: () => fetchMotelById(motelId!),
        enabled: !!motelId,
    });

    useEffect(() => {
        if (isAuthenticated && user) {
            form.setFieldsValue({
                fullName: user.fullName,
                email: user.email,
                phoneNumber: user.phoneNumber,
            });
        }
    }, [user, isAuthenticated, form]);

    const depositAmount = useMemo(() => {
        if (motel) {
            return Math.round(motel.price.value * 0.5);
        }
        return 0;
    }, [motel]);

    const onFinish = async (values: {
        fullName: string;
        phoneNumber: string;
        email: string;
        numberOfGuests: number;
        dateRange: [Dayjs, Dayjs];
    }) => {
        if (!motel || !user) {
            notification.error({ message: 'Không thể gửi yêu cầu, vui lòng thử lại.' });
            return;
        }

        const [startDate, endDate] = values.dateRange;

        const bookingData: Omit<Booking, 'id' | 'status' | 'createdAt' | 'updatedAt'> = {
            motelId: motel.id,
            tenantId: user.id,
            ownerId: motel.owner.id,
            startDate: startDate.toISOString(),
            endDate: endDate.toISOString(),
            numberOfGuests: values.numberOfGuests,
            depositAmount: depositAmount,
            guestInfo: {
                fullName: values.fullName,
                phoneNumber: values.phoneNumber,
                email: values.email,
            },
        };

        try {
            await createBookingAsync(bookingData);
            navigate('/my-bookings');

        } catch (error) {
            console.error("Gửi yêu cầu thất bại:", error);
        }
    };

    if (!isInitialized) {
        return <div className="p-8"><Skeleton active paragraph={{ rows: 10 }} /></div>;
    }

    if (isLoadingMotel) {
        return <div className="p-8"><Skeleton active paragraph={{ rows: 10 }} /></div>;
    }

    if (isError) return <Result status="404" title="Không tìm thấy phòng trọ" extra={<Link to="/"><Button type="primary">Về trang chủ</Button></Link>} />;

    if (!isAuthenticated) return <Result status="403" title="Vui lòng đăng nhập để đặt phòng" extra={<Link to="/login"><Button type="primary">Đăng nhập</Button></Link>} />;

    return (
        <div className="max-w-6xl mx-auto p-4 md:p-8">
            <Title level={2}>Xác nhận & Đặt phòng</Title>
            <Text type="secondary">Bạn sắp gửi yêu cầu đặt phòng cho: <span className="font-semibold text-blue-600">{motel?.title}</span></Text>

            <Row gutter={[48, 32]} className="mt-8">
                <Col xs={24} md={14}>
                    <Form form={form} layout="vertical" onFinish={onFinish} initialValues={{ numberOfGuests: 1 }}>
                        <Title level={4}>1. Chi tiết đặt phòng</Title>
                        <Form.Item name="dateRange" label="Chọn ngày nhận - trả phòng" rules={[{ required: true, message: 'Vui lòng chọn ngày!' }]}>
                            <RangePicker 
                                size="large" 
                                className="w-full" 
                                format="DD-MM-YYYY"
                                placeholder={['Ngày nhận phòng', 'Ngày trả phòng']}
                                disabledDate={(current) => current && current < dayjs().endOf('day')} 
                            />
                        </Form.Item>
                        <Form.Item name="numberOfGuests" label="Số lượng khách" rules={[{ required: true }]}>
                            <InputNumber size="large" min={1} max={motel?.specs.capacity} className="w-full" />
                        </Form.Item>
                        <Divider />
                        <Title level={4}>2. Thông tin liên hệ của bạn</Title>
                        <Form.Item name="fullName" label="Họ và tên" rules={[{ required: true }]}>
                            <Input size="large" />
                        </Form.Item>
                        <Form.Item name="phoneNumber" label="Số điện thoại" rules={[{ required: true }]}>
                            <Input size="large" />
                        </Form.Item>
                        <Form.Item name="email" label="Email" rules={[{ required: true, type: 'email' }]}>
                            <Input size="large" />
                        </Form.Item>
                        <Form.Item className="mt-6">
                            <Button type="primary" htmlType="submit" size="large" block loading={isCreating}>Gửi yêu cầu</Button>
                        </Form.Item>
                    </Form>
                </Col>

                <Col xs={24} md={10}>
                    <Card bordered={false} className="sticky top-8 shadow-md">
                        <div className="flex space-x-4">
                            <img src={motel?.images[0]} alt={motel?.title} className="w-32 h-24 rounded-md object-cover" />
                            <div>
                                <Paragraph strong className="mb-1">{motel?.title}</Paragraph>
                                <Text type="secondary">Chủ nhà: {motel?.owner.fullName}</Text>
                            </div>
                        </div>
                        <Divider />
                        <Title level={4}>Chi tiết phí</Title>
                        <div className="space-y-2">
                            <div className="flex justify-between">
                                <Text>Giá thuê/tháng</Text>
                                <Text>{motel?.price.value.toLocaleString()} VNĐ</Text>
                            </div>
                            <div className="flex justify-between font-bold text-lg pt-2 border-t mt-2">
                                <Text strong>Tiền đặt cọc (50%)</Text>
                                <Text strong className="text-red-600">{depositAmount.toLocaleString()} VNĐ</Text>
                            </div>
                            <Paragraph type="secondary" className="text-xs">
                                Bạn sẽ cần thanh toán khoản phí này sau khi chủ nhà chấp thuận yêu cầu.
                            </Paragraph>
                        </div>
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

export default BookingPage;