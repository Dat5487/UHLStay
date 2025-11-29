import { Card, Typography, Avatar, Tag } from 'antd';
import { Link } from 'react-router-dom';
import type {Post} from "../../types"; // <-- Import Link
const { Title, Paragraph, Text } = Typography;


interface PostCardProps {
    post: Post;
}
const PostCard = ({post} : PostCardProps) => {
    return (
        <Card
            hoverable
            cover={
                <img alt={post.title} src={post.imageUrl} className="h-56 w-full object-cover" />
            }
        >
            <div className="mb-4">
                {post.tags.map(tag =>
                    <Tag key={tag}>
                        {tag}
                    </Tag>
                )}
            </div>
            <Title level={4}>
                <Link to={`/blogs/${post.slug}`} className="text-black hover:text-blue-600">
                    {post.title}
                </Link>
            </Title>
            <Paragraph type="secondary" ellipsis={{ rows: 3 }}>
                {post.excerpt}
            </Paragraph>
            <div className="flex items-center justify-between mt-4">
                <div className="flex items-center">
                    <Avatar src={post.author.avatar} />
                    <Text strong className="ml-2">{post.author.name}</Text>
                </div>
                <Text type="secondary">
                    {new Date(post.publishedAt).toLocaleDateString('vi-VN')}
                </Text>
            </div>
        </Card>
    )
}
export default PostCard;