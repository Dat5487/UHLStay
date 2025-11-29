import { Form, Input, Select, Slider, Checkbox, Button } from 'antd';
import type { FormInstance } from 'antd';
import type {MotelFilters} from "../../types";

const amenitiesOptions: string[] = ['Full nội thất', 'An ninh tốt', 'Gần trường', 'Giờ giấc tự do'];

interface FilterFormProps {
    form: FormInstance<MotelFilters>;
    onFinish: (values: MotelFilters) => void;
    onReset: () => void;
}

export default function FilterFormMotels({ form, onFinish, onReset }: FilterFormProps) {
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
            <Form.Item<MotelFilters> label="Tìm kiếm từ khóa" name="keyword">
                <Input placeholder="Tên đường, quận..." />
            </Form.Item>
            <Form.Item<MotelFilters> label="Thành phố" name="city">
                <Select placeholder="Chọn thành phố" allowClear>
                    {quangNinhDistricts.map(district => (
                        <Select.Option value={district}>{district}</Select.Option>
                    ))}
                </Select>
            </Form.Item>
            <Form.Item<MotelFilters> label="Khoảng giá (triệu VNĐ)" name="priceRange">
                <Slider range min={1} max={10} defaultValue={[1, 8]} step={0.5} />
            </Form.Item>
            <Form.Item<MotelFilters> label="Diện tích (m²)" name="areaRange">
                <Slider range min={10} max={50} defaultValue={[15, 35]} />
            </Form.Item>
            <Form.Item<MotelFilters> label="Tiện ích" name="amenities">
                <Checkbox.Group options={amenitiesOptions} />
            </Form.Item>
            <Form.Item>
                <Button type="primary" htmlType="submit" block className="bg-primary">
                    Áp dụng
                </Button>
            </Form.Item>
            <Form.Item>
                <Button block onClick={onReset}>
                    Xóa bộ lọc
                </Button>
            </Form.Item>
        </Form>
    );
}