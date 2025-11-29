import {Form, Layout, Typography} from 'antd';
import FilterFormMotels from "./FilterFormMotels.tsx";
import type {MotelFilters} from "../../types";

const { Sider } = Layout;
const { Title } = Typography;


interface FilterSiderProps {
    onFilterChange: (values: MotelFilters) => void;
}
const MotelSider = ({ onFilterChange }: FilterSiderProps) => {
    const [form] = Form.useForm<MotelFilters>();

    const onResetFilters = () => {
        form.resetFields();
        onFilterChange({});
    };
    return (
        <Sider width={280} theme="light" style={{ padding: '24px', borderRadius: '8px' }} className="hidden lg:block">
            <Title level={4}>Bộ lọc</Title>
            <FilterFormMotels form={form} onFinish={onFilterChange} onReset={onResetFilters} />
        </Sider>
    )
}
export default MotelSider;