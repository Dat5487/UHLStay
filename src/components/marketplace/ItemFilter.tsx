import {Col, Empty, Pagination, Row, Select, Space, Typography} from "antd";
import {Content} from "antd/es/layout/layout";
import type {Item} from "../../types";
import ItemCard from "./ItemCard.tsx";

const {Title, Text} = Typography;

interface MotelContentProps {
    headerContent?: React.ReactNode;
    items: Item[];
    totalItems: number;
    currentPage: number;
    itemsPerPage: number;
    sortOrder: string;
    onPageChange: (page: number) => void;
    onSortChange: (value: string) => void;
}
const MotelFilter = ({
                         headerContent,
                         items,
                         totalItems,
                         currentPage,
                         itemsPerPage,
                         sortOrder,
                         onPageChange,
                         onSortChange,
                     }: MotelContentProps) => {
    return (
        <Content style={{ padding: '0 24px', minHeight: 280 }}>
            {headerContent}
            <div style={{ marginBottom: '24px' }} className="flex flex-col md:flex-row justify-between items-center gap-4 mt-3">
            <Title level={3} className="!text-xl md:!text-2xl lg:!text-3xl !mb-0">
                Các sản phẩm trao đổi ({totalItems} kết quả)
            </Title>
            <Space className="flex-wrap">
                <Text className="text-sm md:text-base">Sắp xếp theo:</Text>
                <Select value={sortOrder} style={{ width: 150 }} onChange={onSortChange}>
                <Select.Option value="newest">Mới nhất</Select.Option>
                <Select.Option value="price_asc">Giá tăng dần</Select.Option>
                <Select.Option value="price_desc">Giá giảm dần</Select.Option>
                </Select>
            </Space>
            </div>

            {items.length > 0 ? (
                <Row gutter={[24, 24]}>
                    {items.map((item) => (
                        <Col key={item.id} xs={24} sm={12} lg={8}>
                            <ItemCard item={item} />
                        </Col>
                    ))}
                </Row>
            ) : (
                <Empty description="Không tìm thấy sản phẩm nào phù hợp." />
            )}

            <div className="text-center mt-8">
                <Pagination
                    current={currentPage}
                    total={totalItems}
                    pageSize={itemsPerPage}
                    onChange={onPageChange}
                    showSizeChanger={false}
                    className={"flex justify-center !mb-4"}
                />
            </div>
        </Content>
    )
}
export default MotelFilter;