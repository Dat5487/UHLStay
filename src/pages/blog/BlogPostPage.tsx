import {Link, useParams} from "react-router-dom";
import {useQuery} from "@tanstack/react-query";
import {fetchPostBySlug} from "../../services/blogApi.ts";
import {Alert, Avatar, Breadcrumb, Divider, Spin, Tag, Typography} from "antd";
import {HomeOutlined} from "@ant-design/icons";
import PinButton from "../../components/common/button/PinButton.tsx";
import CommentsSection from "../../components/common/section/CommentSection.tsx";

const { Title, Text } = Typography;
const BlogPostPage = () => {
    const { slug } = useParams<{ slug: string }>();

    const { data: post, isLoading, error } = useQuery({
        queryKey: ['post', slug],
        queryFn: () => fetchPostBySlug(slug || ''),
        enabled: !!slug,
    });

    if (isLoading) {
        return <div className="flex justify-center items-center h-screen"><Spin size="large" /></div>;
    }

    if (error || !post) {
        return <Alert message="Lỗi hoặc không tìm thấy bài viết" type="error" className="m-8" />;
    }

    return (
        <div className="max-w-4xl mx-auto p-8 bg-white">
            <Breadcrumb className="mb-8">
                <Breadcrumb.Item>
                    <Link to="/"><HomeOutlined /></Link>
                </Breadcrumb.Item>
                <Breadcrumb.Item>
                    <Link to="/blogs">Blog</Link>
                </Breadcrumb.Item>
                <Breadcrumb.Item>{post.title}</Breadcrumb.Item>
            </Breadcrumb>

            <Title level={1} className="mb-4">{post.title}</Title>

            <div className="flex items-center mb-6">
                <Avatar src={post.author.avatar} size="large" />
                <div className="ml-4">
                    <Text strong>{post.author.name}</Text>
                    <Text type="secondary" className="block">
                        Đăng ngày: {new Date(post.publishedAt).toLocaleDateString('vi-VN')}
                    </Text>
                </div>
            </div>

            <img src={post.imageUrl} alt={post.title} className="w-full h-auto rounded-lg mb-8" />

            <div
                className="prose lg:prose-xl max-w-none"
                dangerouslySetInnerHTML={{ __html: post.content }}
            />

            <div className="mt-8 border-t pt-4">
                <Text strong>Tags: </Text>
                {post.tags.map(tag => <Tag key={tag} color="blue">{tag}</Tag>)}
            </div>
            <div className="mt-6">
                <PinButton itemType="posts" itemId={post.id} />
            </div>
            <Divider/>
            <CommentsSection resourceId={post.id} />
        </div>
    )
}
export default BlogPostPage;