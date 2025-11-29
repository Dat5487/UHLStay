import {Card, Typography} from "antd";
import type {StatCardData} from "../../types";


const {Text, Title} = Typography

interface StatCardProps {
    data: StatCardData;
}

const StatCard = ({ data }: StatCardProps) => {
    // ... JSX để hiển thị data.title, data.total, data.dayValue ...
    // Ví dụ:
    return (
        <Card bordered={false}>
            <Text type="secondary">{data.title}</Text>
            <Title level={3} className="!my-2">{data.total.toLocaleString()}</Title>
            <div className="border-t pt-2 mt-2">
                <Text>Hôm nay: {data.dayValue.toLocaleString()}</Text>
            </div>
        </Card>
    );
};
export default StatCard;