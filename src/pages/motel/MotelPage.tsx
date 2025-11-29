import {useState, useMemo, useEffect} from 'react';
import {Alert, Button, Drawer, Form, Layout, Spin} from 'antd';
import type {MotelFilters, Motel} from '../../types';
import MotelSider from "../../components/motels/MotelSider.tsx";
import MotelFilter from "../../components/motels/MotelFilter.tsx";
import {FilterOutlined} from "@ant-design/icons";
import FilterFormMotels from "../../components/motels/FilterFormMotels.tsx";
import { useSearchParams } from 'react-router-dom';
import {fetchAllMotels} from "../../services/motelApi.ts";
import {useQuery} from "@tanstack/react-query";

const MotelPage = () => {
    const [form] = Form.useForm<MotelFilters>();
    const [searchParams] = useSearchParams();
    const [filters, setFilters] = useState<MotelFilters>({});
    const [sortOrder, setSortOrder] = useState<string>('newest');
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [drawerVisible, setDrawerVisible] = useState(false);
    const [isLoading] = useState(false); // Set to false since we're using local data
    const [error] = useState<Error | null>(null); // No error for local data
    const itemsPerPage = 9;

    // Sync keyword from URL query string to filters and form
    useEffect(() => {
        const keyword = searchParams.get('keyword') || undefined;
        setFilters(prev => ({
            ...prev,
            keyword
        }));
        form.setFieldsValue({ keyword });
        setCurrentPage(1);
    }, [searchParams, form]);

    const {data: allMotels = []} = useQuery<Motel[], Error>({
        queryKey: ['motels', filters],
        queryFn: () => fetchAllMotels(filters),
    })

    // Filter the motels based on the current filters
    const filteredMotels = useMemo(() => {
        return allMotels.filter(motel => {
            // Filter by keyword (search in title, description, district)
            if (filters.keyword) {
                const searchTerm = filters.keyword.toLowerCase();
                const titleMatch = motel.title.toLowerCase().includes(searchTerm);
                const descriptionMatch = motel.description.toLowerCase().includes(searchTerm);
                const districtMatch = motel.district.toLowerCase().includes(searchTerm);
                if (!titleMatch && !descriptionMatch && !districtMatch) {
                    return false;
                }
            }
            
            // Filter by city
            if (filters.city && motel.city !== filters.city) {
                return false;
            }
            
            // Filter by price range (convert from millions to actual price)
            if (filters.priceRange && Array.isArray(filters.priceRange)) {
                const [minPrice, maxPrice] = filters.priceRange;
                const priceInMillions = motel.price.value / 1000000;
                if (priceInMillions < minPrice || priceInMillions > maxPrice) {
                    return false;
                }
            }
            
            // Filter by area range
            if (filters.areaRange && Array.isArray(filters.areaRange)) {
                const [minArea, maxArea] = filters.areaRange;
                if (motel.area < minArea || motel.area > maxArea) {
                    return false;
                }
            }
            
            // Filter by amenities (if motel has all selected amenities)
            if (filters.amenities && filters.amenities.length > 0) {
                const hasAllAmenities = filters.amenities.every(amenity => 
                    motel.amenities.includes(amenity)
                );
                if (!hasAllAmenities) {
                    return false;
                }
            }
            
            return true;
        });
    }, [allMotels, filters.amenities, filters.areaRange, filters.city, filters.keyword, filters.priceRange]);

    // Sort and paginate the filtered motels
    const paginatedAndSortedMotels = useMemo(() => {
        if (!filteredMotels) return [];

        // Sort the filtered data
        const sorted = [...filteredMotels].sort((a, b) => {
            switch (sortOrder) {
                case 'price_asc': 
                    return a.price.value - b.price.value;
                case 'price_desc': 
                    return b.price.value - a.price.value;
                case 'area_asc':
                    return a.area - b.area;
                case 'area_desc':
                    return b.area - a.area;
                default: // 'newest'
                    return (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0);
            }
        });

        // Paginate the sorted data
        const startIndex = (currentPage - 1) * itemsPerPage;
        return sorted.slice(startIndex, startIndex + itemsPerPage);
    }, [filteredMotels, sortOrder, currentPage]);

    const handleFilterChange = (values: MotelFilters) => {
        form.setFieldsValue(values);
        setFilters(values);
        setCurrentPage(1); // Reset to first page when filters change
        setDrawerVisible(false);
    };

    const handleResetFilters = () => {
        form.resetFields();
        setFilters({});
        setCurrentPage(1);
        setDrawerVisible(false);
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <Spin size="large" tip="Đang tải dữ liệu nhà trọ..."/>
            </div>
        );
    }

    if (error) {
        return (
            <Alert 
                message="Lỗi" 
                description={error.message} 
                type="error" 
                showIcon 
                className="m-8"
            />
        );
    }

    return (
        <>
            <Layout>
                <MotelSider onFilterChange={handleFilterChange}/>
                <Layout>
                    <MotelFilter
                        headerContent={
                            <Button
                                icon={<FilterOutlined/>}
                                onClick={() => setDrawerVisible(true)}
                                className={"lg:!hidden w-full !my-4"}
                            >
                                Lọc kết quả
                            </Button>
                        }
                        motels={paginatedAndSortedMotels}
                        totalMotels={filteredMotels?.length || 0}
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
                <FilterFormMotels 
                    form={form} 
                    onFinish={handleFilterChange} 
                    onReset={handleResetFilters}
                />
            </Drawer>
        </>
    );
}

export default MotelPage;