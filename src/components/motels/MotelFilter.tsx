import {
  Col,
  Empty,
  Pagination,
  Row,
  Select,
  Space,
  Typography,
  Rate,
} from "antd";

import MotelCard from "./MotelCard.tsx";
import { Content } from "antd/es/layout/layout";
import type { Motel } from "../../types";

const { Title, Text } = Typography;

interface MotelContentProps {
  headerContent?: React.ReactNode;
  motels: Motel[];
  totalMotels: number;
  currentPage: number;
  itemsPerPage: number;
  sortOrder: string;
  onPageChange: (page: number) => void;
  onSortChange: (value: string) => void;
}
const MotelFilter = ({
  headerContent,
  motels,
  totalMotels,
  currentPage,
  itemsPerPage,
  sortOrder,
  onPageChange,
  onSortChange,
}: MotelContentProps) => {
  return (
    <Content style={{ padding: "0 24px", minHeight: 280 }}>
      {headerContent}
      <div
        style={{ marginBottom: "24px" }}
        className="flex flex-col md:flex-row justify-between items-center gap-4 mt-3"
      >
        <Title level={3} className="!text-xl md:!text-2xl lg:!text-3xl !mb-0">
          Danh sách phòng trọ ({totalMotels} kết quả)
        </Title>
        <Space className="flex-wrap">
          <Text className="text-sm md:text-base">Sắp xếp theo:</Text>
          <Select
            value={sortOrder}
            style={{ width: 150 }}
            onChange={onSortChange}
          >
            <Select.Option value="newest">Mới nhất</Select.Option>
            <Select.Option value="price_asc">Giá tăng dần</Select.Option>
            <Select.Option value="price_desc">Giá giảm dần</Select.Option>
          </Select>
        </Space>
      </div>

      {motels.length > 0 ? (
        <Row gutter={[24, 24]}>
          {motels.map((motel, index) => (
            <Col key={motel.id} xs={24} sm={12} lg={8}>
              {index === 0 ? (
                <div className="relative">
                  <div className="absolute -top-4 sm:-top-5 left-1/2 transform -translate-x-1/2 z-10 bg-black text-white px-3 sm:px-5 py-1.5 sm:py-2 rounded-lg shadow-xl flex items-center justify-center gap-1 sm:gap-2">
                    <Rate
                      disabled
                      defaultValue={5}
                      className="flex items-center justify-center"
                      style={{
                        fontSize: "clamp(10px, 2vw, 14px)",
                        color: "#fbbf24",
                        display: "flex",
                      }}
                    />
                  </div>
                  <div className="mt-2 sm:mt-3 relative rounded-2xl overflow-hidden border-2 border-black shadow-2xl bg-white">
                    <div className="absolute top-0 left-0 right-0 h-1.5 sm:h-2 bg-gradient-to-r from-yellow-400 via-red-500 to-pink-500"></div>
                    <MotelCard motel={motel} />
                  </div>
                </div>
              ) : (
                <MotelCard motel={motel} />
              )}
            </Col>
          ))}
        </Row>
      ) : (
        <Empty description="Không tìm thấy phòng trọ nào phù hợp." />
      )}

      <div className="text-center mt-8">
        <Pagination
          current={currentPage}
          total={totalMotels}
          pageSize={itemsPerPage}
          onChange={onPageChange}
          showSizeChanger={false}
          className={"flex justify-center !mb-4"}
        />
      </div>
    </Content>
  );
};
export default MotelFilter;
