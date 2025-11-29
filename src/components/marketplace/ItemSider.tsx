import {type FormInstance, Layout, Typography} from 'antd';
import type {ItemFiltersType} from '../../types';
import FilterFormItems from "./FilterFormItems.tsx";

const { Sider } = Layout;
const { Title } = Typography;


interface FilterSiderProps {
    form: FormInstance<ItemFiltersType>;
    onFilterChange: (values: ItemFiltersType) => void;
    onResetFilters: () => void;
}
const ItemSider = ({ form, onFilterChange, onResetFilters }: FilterSiderProps) => {
    return (
        <Sider width={280} theme="light" style={{ padding: '24px', borderRadius: '8px' }} className="hidden lg:block">
        <Title level={4} className="mb-6">Bộ lọc</Title>
            <FilterFormItems
                form={form}
                onFinish={onFilterChange}
                onReset={onResetFilters}
            />
        </Sider>
    );
}
export default ItemSider;