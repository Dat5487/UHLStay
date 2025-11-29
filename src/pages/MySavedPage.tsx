import {Col, Empty, Row, Spin, Tabs, type TabsProps, Typography} from "antd";
import {selectPinnedItems} from "../store/slices/userActionSlice.ts";
import {useQueries} from "@tanstack/react-query";
import {useAppSelector} from "../store/hooks.ts";
import {fetchMotelsByIds} from "../services/motelApi.ts";
import {fetchPostsByIds} from "../services/blogApi.ts";
import {fetchItemsByIds} from "../services/marketApi.ts";
import {useMemo} from "react";
import type {DisplayCardData, Item, Motel, Post} from "../types";
import UnifiedCard from "../components/common/card/UnifiedCard.tsx";

const {Title} = Typography;

const MySavedPage = () => {
    const pinnedData = useAppSelector(selectPinnedItems);

    // Dùng useQueries để fetch song song dữ liệu cho cả 3 loại
    const results = useQueries({
        queries: [
            {
                queryKey: ['saved_motels', pinnedData.motels],
                queryFn: () => fetchMotelsByIds(pinnedData.motels),
                enabled: pinnedData.motels.length > 0,
            },
            {
                queryKey: ['saved_items', pinnedData.items],
                queryFn: () => fetchItemsByIds(pinnedData.items),
                enabled: pinnedData.items.length > 0,
            },
            {
                queryKey: ['saved_posts', pinnedData.posts],
                queryFn: () => fetchPostsByIds(pinnedData.posts),
                enabled: pinnedData.posts.length > 0,
            },
        ],
    });

    const isLoading = results.some(query => query.isLoading);
    const motelResults = results[0].data as Motel[] || [];
    const itemResults = results[1].data as Item[] || [];
    const postResults = results[2].data as Post[] || [];

    const unifiedList = useMemo(() => {
        const motels: DisplayCardData[] = motelResults.map(motel => ({
            id: motel.id,
            type: 'Phòng trọ',
            title: motel.title,
            price: motel.price.value,
            imageUrl: motel.images?.[0] || 'https://via.placeholder.com/400x300?text=No+Image',
            subInfo: `${motel.district}, ${motel.city}`,
            link: `/motels/${motel.id}`,
            createdAt: motel.createdAt,
        }));

        const items: DisplayCardData[] = itemResults.map(item => ({
            id: item.id,
            type: 'Đồ cũ',
            title: item.title,
            price: item.price,
            imageUrl: item.images?.[0] || 'https://via.placeholder.com/400x300?text=No+Image',
            subInfo: item.category,
            link: `/items/${item.id}`,
            createdAt: item.createdAt,
        }));

        const posts: DisplayCardData[] = postResults.map(post => ({
            id: post.id,
            type: 'Blog',
            title: post.title,
            price: 0,
            imageUrl: post.imageUrl,
            subInfo: `bởi ${post.author.name}`,
            link: `/blogs/${post.slug}`,
            createdAt: new Date(post.publishedAt),
        }));

        return [...motels, ...items, ...posts]
            .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

    }, [motelResults, itemResults, postResults]);


    const ItemGrid = ({items}: { items: DisplayCardData[] }) => {
        if (isLoading) return <div className="text-center p-10"><Spin/></div>;
        if (items.length === 0) return <Empty className="mt-10" description="Không có tin nào trong mục này."/>;
        return (
            <Row gutter={[24, 24]} className="mt-6">
                {items.map(item => (
                    <Col key={`${item.type}-${item.id}`} xs={24} sm={12} md={8} xl={6}>
                        <UnifiedCard item={item}/>
                    </Col>
                ))}
            </Row>
        );
    };
    const tabItems: TabsProps['items'] = [
        {key: 'all', label: `Tất cả (${unifiedList.length})`, children: <ItemGrid items={unifiedList}/>},
        {
            key: 'motels',
            label: `Phòng trọ (${pinnedData.motels.length})`,
            children: <ItemGrid items={unifiedList.filter(i => i.type === 'Phòng trọ')}/>
        },
        {
            key: 'items',
            label: `Đồ cũ (${pinnedData.items.length})`,
            children: <ItemGrid items={unifiedList.filter(i => i.type === 'Đồ cũ')}/>
        },
        {
            key: 'posts',
            label: `Bài viết (${pinnedData.posts.length})`,
            children: <ItemGrid items={unifiedList.filter(i => i.type === 'Blog')}/>
        },
    ];

    return (
        <div className="max-w-7xl mx-auto p-4 md:p-8">
            <Title level={2} className="mb-8">Tin đã lưu của tôi</Title>
            <Tabs defaultActiveKey="all" items={tabItems}/>
        </div>
    );
};

export default MySavedPage;