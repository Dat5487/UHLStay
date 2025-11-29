import {Card, Col, Form, Input, Row, Select} from "antd";
import type {FilterConfig} from "../../../types";
import {useEffect, useState} from "react";
import {useDebounce} from "../../../hooks/useDebounce.ts";

const { Search } = Input;
type FiltersState = Record<string, any>;
interface AdminFilterBarProps {
    config: FilterConfig[];
    onFiltersChange: (filters: FiltersState) => void;
}
const AdminFilterBar = ({ config, onFiltersChange }: AdminFilterBarProps) => {
    const [form] = Form.useForm();
    const [internalFilters, setInternalFilters] = useState<FiltersState>({});

    const debouncedKeyword = useDebounce(internalFilters['keyword'], 500);

    useEffect(() => {
        onFiltersChange({ ...internalFilters, keyword: debouncedKeyword });
    }, [debouncedKeyword]);

    const handleValuesChange = (changedValues: any, allValues: any) => {
        // Với các trường `select`, cập nhật ngay lập tức
        if (!('keyword' in changedValues)) {
            onFiltersChange(allValues);
        }
        setInternalFilters(allValues);
    };

    return (
        <Card className="mb-6">
            <Form form={form} onValuesChange={handleValuesChange}>
                <Row gutter={24}>
                    {config.map(item => (
                        <Col xs={24} md={8} key={item.name}>
                            <Form.Item name={item.name} label={item.label}>
                                {item.type === 'search' ? (
                                    <Search placeholder={item.placeholder} allowClear size="large" />
                                ) : (
                                    <Select placeholder={item.placeholder} options={item.options} allowClear size="large" />
                                )}
                            </Form.Item>
                        </Col>
                    ))}
                </Row>
            </Form>
        </Card>
    );
};

export default AdminFilterBar;