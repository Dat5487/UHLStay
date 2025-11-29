    import type {Item, ItemFiltersType} from "../../types";
    import {Alert, Button, Drawer, Form, Layout, Spin} from "antd";
    import {useMemo, useState} from "react";
    import ItemFilter from "../../components/marketplace/ItemFilter.tsx";
    import ItemSider from "../../components/marketplace/ItemSider.tsx";
    import {FilterOutlined} from "@ant-design/icons";
    import FilterFormItems from "../../components/marketplace/FilterFormItems.tsx";
    import {useQuery} from "@tanstack/react-query";
    import {fetchAllItems} from "../../services/marketApi.ts";

    const MarketPage = () => {

        const [form] = Form.useForm<ItemFiltersType>();
        const [filters, setFilters] = useState<ItemFiltersType>({ listingType: 'all' });
        const [sortOrder, setSortOrder] = useState<string>('newest');
        const [currentPage, setCurrentPage] = useState<number>(1);
        const [drawerVisible, setDrawerVisible] = useState(false);
        const itemsPerPage = 9;

        const {data: filteredItems, isLoading, error } = useQuery<Item[], Error>({
            queryKey: ['items', filters],
            queryFn: () => fetchAllItems(filters),
        })

        const paginatedAndSortedItems = useMemo(() => {
            if (!filteredItems) return [];

            const sorted = [...filteredItems].sort((a, b) => {
                switch (sortOrder) {
                    case 'price_asc': return a.price - b.price;
                    case 'price_desc': return b.price - a.price;
                    default: return (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0);
                }
            });

            const startIndex = (currentPage - 1) * itemsPerPage;
            return sorted.slice(startIndex, startIndex + itemsPerPage);
        }, [filteredItems, sortOrder, currentPage]);


        const handleFilterChange = (values: ItemFiltersType) => {
            form.setFieldsValue(values);
            setFilters(values);
            setCurrentPage(1);
            setDrawerVisible(false);
        };

        const handleResetFilters = () => {
            form.resetFields();
            setFilters({});
            setCurrentPage(1);
        };

        if (isLoading)
        {
            return <div className={"flex justify-center items-center h-screen"}>
                <Spin size="large" tip="Đang tải dữ liệu sản phẩm..."/>
            </div>
        }

        if (error)
        {
            return <Alert message="Lỗi" description={error.message} type="error" showIcon className="m-8"/>;
        }

        return (
            <>
                <Layout>
                    <ItemSider
                        onFilterChange={handleFilterChange}
                        onResetFilters={handleResetFilters}
                        form={form}
                    />
                    <Layout>
                        <ItemFilter
                            headerContent={
                                <Button
                                    icon={<FilterOutlined/>}
                                    onClick={() => setDrawerVisible(true)}
                                    className={"lg:!hidden w-full !my-4"}
                                >
                                    Lọc kết quả
                                </Button>
                            }
                            items={paginatedAndSortedItems}
                            totalItems={filteredItems?.length || 0}
                            currentPage={currentPage}
                            itemsPerPage={itemsPerPage}
                            sortOrder={sortOrder}
                            onPageChange={setCurrentPage}
                            onSortChange={setSortOrder}
                        />
                    </Layout>
                </Layout>
                <Drawer
                    title="Bộ lọc"
                    placement="left"
                    onClose={() => setDrawerVisible(false)}
                    open={drawerVisible}
                    className="lg:hidden"
                >
                    <FilterFormItems
                        form={form}
                        onFinish={handleFilterChange}
                        onReset={handleResetFilters}
                    />
                </Drawer>
            </>
        );
    }
    export default MarketPage;