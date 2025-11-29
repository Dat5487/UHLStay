import {Col, Row, Skeleton, Space} from "antd";
import {
    fetchLatestMotels,
    fetchNearbyMotels,
    fetchPopularTags,
    fetchRelatedArticles
} from "../../../services/motelApi.ts";
import {useQuery} from "@tanstack/react-query";
import ArticleCard from "../../common/card/ArticleCard.tsx";
import ListingCard from "../../common/card/ListingCard.tsx";

const SectionTitle: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <h3 className="text-lg font-bold text-black border-l-4 border-green-500 pl-3 mb-4 !mt-8">
        {children}
    </h3>
);

interface RelatedContentProps {
    currentMotelId: string;
}

const RelatedContent: React.FC<RelatedContentProps> = ({ currentMotelId }) => {
    // Sử dụng useQuery để gọi đồng thời các API
    const { data: articles, isLoading: isLoadingArticles } = useQuery({
        queryKey: ['relatedArticles'],
        queryFn: fetchRelatedArticles
    });
    const { data: nearbyMotels, isLoading: isLoadingNearby } = useQuery({
        queryKey: ['nearbyMotels', currentMotelId],
        queryFn: () => fetchNearbyMotels(currentMotelId)
    });
    const { data: latestMotels, isLoading: isLoadingLatest } = useQuery({
        queryKey: ['latestMotels'],
        queryFn: fetchLatestMotels
    });
    const { data: tags, isLoading: isLoadingTags } = useQuery({
        queryKey: ['popularTags'],
        queryFn: fetchPopularTags
    });

    const isLoading = isLoadingArticles || isLoadingNearby || isLoadingLatest || isLoadingTags;

    if (isLoading) {
        return <Skeleton active paragraph={{ rows: 10 }} />;
    }

    return (
        <div className="!space-y-12">
            {/* 1. Các bài viết liên quan */}
            <section>
                <SectionTitle>Các bài viết liên quan</SectionTitle>
                <Row gutter={[16, 16]}>
                    {articles?.map(article => (
                        <Col xs={24} sm={12} md={8} key={article.id}>
                            <ArticleCard article={article} />
                        </Col>
                    ))}
                </Row>
            </section>

            {/* 2. Tin đăng cùng khu vực */}
            <section>
                <SectionTitle>Tin đăng cùng khu vực</SectionTitle>
                <div className="space-y-4">
                    {nearbyMotels?.map(motel => <ListingCard key={motel.id} motel={motel} />)}
                </div>
            </section>

            {/* 3. Tin mới cập nhật */}
            <section>
                <SectionTitle>Tin mới cập nhật</SectionTitle>
                <div className="space-y-4">
                    {latestMotels?.map(motel => <ListingCard key={motel.id} motel={motel} />)}
                </div>
            </section>

            {/* 4. Xem theo từ khóa */}
            <section>
                <SectionTitle>Xem theo từ khóa</SectionTitle>
                <Space size={[8, 16]} wrap>
                    {tags?.map(tag => (
                        <a href={tag.url} key={tag.name} className="px-3 py-1 text-blue-400 rounded-md text-sm hover:bg-gray-600">
                            {tag.name}
                        </a>
                    ))}
                </Space>
            </section>
        </div>
    );
};

export default RelatedContent;