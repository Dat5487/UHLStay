import React from 'react';
import { useQuery } from '@tanstack/react-query';
import {Table, Button, Typography} from 'antd';
import {useTransactionMutations} from "../../hooks/useTransactionMutations.ts";
import {useAuth} from "../../hooks/useAuth.ts";
import type {ColumnsType} from "antd/es/table";
import {fetchPendingPayouts} from "../../services/bookingApi.ts";
import {Link} from "react-router-dom";
import type {PopulatedTransaction} from "../../types";

const {Title} = Typography;

const AdminPayoutPage: React.FC = () => {
    const { user, isAuthenticated } = useAuth();
    const { data: payouts, isLoading } = useQuery({
        queryKey: ['pendingPayouts'],
        queryFn: fetchPendingPayouts,
        enabled: isAuthenticated && user?.role.name === 'admin',
    });

    const { markAsPaid, isLoading: isMutating } = useTransactionMutations();

    const columns: ColumnsType<PopulatedTransaction> = [
        {
            title: 'Chủ nhà',
            dataIndex: ['bookingInfo', 'owner', 'fullName'],
            key: 'ownerName',
        },
        {
            title: 'Phòng trọ',
            dataIndex: ['bookingInfo', 'motel', 'title'],
            key: 'motelTitle',
            render: (text, record) => <Link to={`/motels/${record.bookingInfo?.motel.id}`}>{text}</Link>
        },
        {
            title: 'Tổng tiền nhận',
            dataIndex: 'totalAmountReceived',
            key: 'totalAmount',
            render: (amount: number) => `${amount.toLocaleString()} VNĐ`,
        },
        {
            title: 'Hoa hồng (10%)',
            dataIndex: 'commissionFeeEarned',
            key: 'commission',
            render: (amount: number) => `${amount.toLocaleString()} VNĐ`,
        },
        {
            title: 'Cần trả cho Chủ nhà',
            dataIndex: 'payoutDueToLandlord',
            key: 'payoutDue',
            render: (amount: number) => <strong className="text-green-600">{amount.toLocaleString()} VNĐ</strong>,
        },
        {
            title: 'Hành động',
            key: 'action',
            render: (_, record) => (
                <Button
                    type="primary"
                    onClick={() => markAsPaid(record.id)}
                    loading={isMutating}
                >
                    Xác nhận Đã thanh toán
                </Button>
            ),
        },
    ];

    return (
        <div className="p-4 md:p-8">
            <Title level={2} className="mb-6">Quản lý Thanh toán cho Chủ nhà</Title>
            <Table
                columns={columns}
                dataSource={payouts}
                loading={isLoading}
                rowKey="id"
                bordered
                scroll={{ x: 1000 }}
            />
        </div>
    );
};

export default AdminPayoutPage;