import { Card, Typography } from 'antd';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
const {Title} = Typography;

interface RevenueChartProps {
    data: { name: string; revenue: number }[];
}

const RevenueChart = ({data}: RevenueChartProps) => (
    <Card bordered={false} className="shadow-sm h-full">
        <Title level={4}>Doanh thu theo tháng</Title>
        <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data} margin={{top: 5, right: 20, left: 20, bottom: 5}}>
                <CartesianGrid strokeDasharray="3 3"/>
                <XAxis dataKey="name"/>
                <YAxis tickFormatter={(value) => `${(value as number) / 1000000}tr`}/>
                <Tooltip formatter={(value) => `${(value as number).toLocaleString()} VNĐ`}/>
                <Legend/>
                <Line type="monotone" dataKey="revenue" name="Doanh thu" stroke="#8884d8" activeDot={{r: 8}}/>
            </LineChart>
        </ResponsiveContainer>
    </Card>
);

export default RevenueChart;
