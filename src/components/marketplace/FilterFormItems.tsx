import {Form, Input, Button, Select, Row, Col, Radio, Slider} from 'antd';
import type {FormInstance} from 'antd';
import type {ItemFiltersType} from "../../types";

interface ItemFormProps {
    form: FormInstance<ItemFiltersType>;
    onFinish: (values: ItemFiltersType) => void;
    onReset: () => void;
}

const FilterFormItems = ({form, onFinish, onReset}: ItemFormProps) => {
    const quangNinhDistricts = [
        "Tổ 1, Nam Trung, Nam Khê",
        "Khu Biểu Nghi, Đông Mai, Quảng Yên",
        "HKTT: Cẩm Sơn, Cẩm Phả, Quảng Ninh - Nhà trọ: Tổ 1, Nam Trung",
        "Tổ 3, Nam Trung",
        "Tổ 1, Nam Trung",
        "Tổ 5, Nam Trung",
        "Tổ 2, Nam Trung",
        "HKTT: Tổ 6, Tre Mai - Nhà trọ: Tổ 2, Nam Trung",
        "HKTT: Khu Bình An, TT. Bình Liêu, huyện Bình Liêu, tỉnh Quảng Ninh - Nhà trọ: Tổ 2, Nam Trung",
        "Tổ 4, Nam Trung",
        "Tổ 4, Nam Tân, Nam Khê, Uông Bí",
        "Tổ 5, Nam Tân, Nam Khê, Uông Bí",
        "Tổ 1, khu Chạp Khê",
        "HKTT: thị trấn Tiên Yên, huyện Tiên Yên, tỉnh Quảng Ninh - Nhà trọ thuộc: Tổ 4, Chạp Khê, Nam Khê",
        "HKTT: Kênh Giang, Thủy Nguyên, Hải Phòng",
        "Tổ 5, Chạp Khê"
    ];
    return (
        <Form form={form} layout="vertical" onFinish={onFinish}>
            <Form.Item name="keyword" label="Tìm theo tên">
                <Input.Search placeholder="Nhập tên món đồ..." onSearch={() => form.submit()} enterButton/>
            </Form.Item>

            <Form.Item name="category" label="Danh mục">
                <Select placeholder="Tất cả danh mục" allowClear>
                    <Select.Option value="furniture">Nội thất</Select.Option>
                    <Select.Option value="electronics">Đồ điện tử</Select.Option>
                    <Select.Option value="kitchenware">Đồ bếp</Select.Option>
                    <Select.Option value="books">Sách vở</Select.Option>
                    <Select.Option value="clothing">Quần áo</Select.Option>
                    <Select.Option value="other">Khác</Select.Option>
                </Select>
            </Form.Item>

            <Form.Item name="building" label="Khu vực">
                <Select placeholder="Tất cả khu vực" allowClear>
                    {quangNinhDistricts.map(district => (
                        <Select.Option value={district}>{district}</Select.Option>
                    ))}
                </Select>
            </Form.Item>

            <Form.Item name="condition" label="Tình trạng">
                <Select placeholder="Tất cả tình trạng" allowClear>
                    <Select.Option value="new">Mới</Select.Option>
                    <Select.Option value="like_new">Như mới</Select.Option>
                    <Select.Option value="used">Đã dùng</Select.Option>
                </Select>
            </Form.Item>

            <Form.Item name="listingType" label="Hình thức">
                <Radio.Group style={{ width: '100%' }}>
                    <Row gutter={[8, 8]} justify="space-between">
                        <Col span={12}>
                            <Radio style={{ width: '100%' }} value="all">Tất cả</Radio>
                        </Col>
                        <Col span={12}>
                            <Radio style={{ width: '100%' }} value="sell">Bán</Radio>
                        </Col>
                        <Col span={12}>
                            <Radio style={{ width: '100%' }} value="free">Miễn phí</Radio>
                        </Col>
                        <Col span={12}>
                            <Radio style={{ width: '100%' }} value="trade">Trao đổi</Radio>
                        </Col>
                    </Row>
                </Radio.Group>
            </Form.Item>

            <Form.Item name="priceRange" label="Khoảng giá (nghìn VNĐ)">
                <Slider range max={5000} step={50} tooltip={{formatter: (value) => `${value}k`}}/>
            </Form.Item>

            <Form.Item>
                <Row gutter={8}>
                    <Col span={12}>
                        <Button type="primary" htmlType="submit" block>
                            Áp dụng
                        </Button>
                    </Col>
                    <Col span={12}>
                        <Button htmlType="button" onClick={onReset} block>
                            Xóa bộ lọc
                        </Button>
                    </Col>
                </Row>
            </Form.Item>
        </Form>
    );
};

export default FilterFormItems;