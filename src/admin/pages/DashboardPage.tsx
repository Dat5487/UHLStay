import {Alert, Card, Col, Row, Spin, Typography, Table} from "antd";
import {useQuery} from "@tanstack/react-query";
import {fetchAdminDashboardData} from "../services/adminApi.ts";
import StatCard from "../components/StatCard.tsx";
import {
    Bar,
    BarChart,
    CartesianGrid,
    Legend,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis
} from "recharts";

const { Title } = Typography;

const AdminDashboardPage = () => {
    const { data, isLoading, error } = useQuery({
        queryKey: ['dashboardStats'],
        queryFn: fetchAdminDashboardData,
    });

    if (isLoading) return <Spin size="large" fullscreen />;
    if (error) return <Alert message="Lỗi tải dữ liệu" type="error" />;
    if (!data) return <p>Không có dữ liệu.</p>;

    return (
        <div className="space-y-6">
            <Title level={4}>Dashboard tổng quan UniStay</Title>

            <Row gutter={[24, 24]}>
                <Col xs={24} md={12} xl={6}><StatCard data={data.totalListings} /></Col>
                <Col xs={24} md={12} xl={6}><StatCard data={data.listingViews} /></Col>
                <Col xs={24} md={12} xl={6}><StatCard data={data.occupancyRate} /></Col>
                <Col xs={24} md={12} xl={6}><StatCard data={data.newUsers} /></Col>
            </Row>

            <Row gutter={[24, 24]}>
                <Col xs={24} lg={16}>
                    <Card title="Số lượng tin đăng mới">
                        <div style={{ height: 288 }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={data.newListingsTrend}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="month" />
                                    <YAxis allowDecimals={false} />
                                    <Tooltip />
                                    <Legend />
                                    <Bar dataKey="motels" name="Phòng trọ" fill="#1677ff" radius={[4, 4, 0, 0]} />
                                    <Bar dataKey="items" name="Đồ cũ" fill="#52c41a" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </Card>
                </Col>
                <Col xs={24} lg={8}>
                    <Card title="Top tin được xem nhiều">
                        <Table
                            size="small"
                            rowKey={(record) => String(record.rank)}
                            dataSource={data.topViewedListings}
                            pagination={false}
                            columns={[
                                { title: "#", dataIndex: "rank", key: "rank", width: 60 },
                                { title: "Tiêu đề", dataIndex: "title", key: "title", ellipsis: true },
                                {
                                    title: "Lượt xem",
                                    dataIndex: "views",
                                    key: "views",
                                    align: "right" as const,
                                    render: (value: number) => value.toLocaleString()
                                }
                            ]}
                        />
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

export default AdminDashboardPage;