import {useQuery} from "@tanstack/react-query";
import {Alert, Col, Pagination, Row, Spin, Typography} from "antd";
import {fetchAllPosts} from "../../services/blogApi.ts";
import PostCard from "../../components/blog/PostCard.tsx";
import {useMemo, useState} from "react";
const { Title } = Typography;
const POSTS_PER_PAGE = 6;
const BlogPage = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const {data: posts, isLoading, error } = useQuery({
    queryKey: ['post'],
    queryFn: fetchAllPosts,
  });
  const currentPosts = useMemo(() => {
    if (!posts) return [];
    const startIndex = (currentPage - 1) * POSTS_PER_PAGE;
    const endIndex = startIndex + POSTS_PER_PAGE;
    return posts.slice(startIndex, endIndex);
  }, [posts, currentPage]);

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen"><Spin size="large" /></div>;
  }

  if (error) {
    return <Alert message="Lỗi tải danh sách bài viết" type="error" className="m-8" />;
  }

  return (
      <div className="max-w-7xl mx-auto p-8">
        <Title level={1} className="mb-8 text-center">Các bài viết</Title>
        {currentPosts.length > 0 ? (
            <Row gutter={[32, 32]}>
              {currentPosts.map(post => (
                  <Col key={post.id} xs={24} md={12} lg={8}>
                    <PostCard post={post} />
                  </Col>
              ))}
            </Row>
        ) : (
            <p className="text-center">Không có bài viết nào.</p>
        )}
        <div className="flex justify-center mt-12">
          <Pagination
              current={currentPage}
              pageSize={POSTS_PER_PAGE}
              total={posts?.length || 0}
              onChange={(page) => setCurrentPage(page)}
              showSizeChanger={false}
          />
        </div>
      </div>
  )
};
export default BlogPage;