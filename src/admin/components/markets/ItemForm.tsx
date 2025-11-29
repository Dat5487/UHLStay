import {Space, type FormInstance, Button, Form, Input, Select, Row, Col, InputNumber, Radio, Upload} from "antd";
import type {Item} from "../../../types";
import {useEffect} from "react";
import {PlusOutlined} from "@ant-design/icons";

type ItemFormData = Omit<Item, 'id' | 'createdAt' | 'seller'>;
interface ItemFormProps {
    form: FormInstance;
    initialValues?: Partial<Item> | null;
    onSubmit: (values: ItemFormData) => void;
    onCancel: () => void;
    isLoading: boolean;
    isEditMode: boolean;
}
const normFile = (e: any) => {
    if (Array.isArray(e)) {
        return e;
    }
    return e?.fileList;
};

const ItemForm = ({ form, initialValues, onSubmit, onCancel, isLoading, isEditMode }: ItemFormProps) => {
    useEffect(() => {
        if (initialValues) {
            form.setFieldsValue(initialValues);
        } else {
            form.resetFields();
        }
    }, [initialValues, form]);
    return (
        <Form form={form} layout="vertical" onFinish={onSubmit}>
            <Form.Item name="title" label="Tiêu đề tin đăng" rules={[{ required: true, message: 'Vui lòng nhập tiêu đề' }]}>
                <Input placeholder="Ví dụ: Pass lại bàn làm việc gỗ thông..." />
            </Form.Item>

            <Form.Item name="description" label="Mô tả chi tiết" rules={[{ required: true, message: 'Vui lòng nhập mô tả' }]}>
                <Input.TextArea rows={4} placeholder="Mô tả tình trạng, kích thước, lý do pass lại..." />
            </Form.Item>

            <Row gutter={16}>
                <Col span={12}>
                    <Form.Item name="price" label="Giá (VNĐ)" rules={[{ required: true, message: 'Vui lòng nhập giá' }]}>
                        <InputNumber className="w-full" min={0} step={10000} formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')} />
                    </Form.Item>
                </Col>
                <Col span={12}>
                    <Form.Item name="category" label="Danh mục" rules={[{ required: true, message: 'Vui lòng chọn danh mục' }]}>
                        <Select placeholder="Chọn danh mục">
                            <Select.Option value="furniture">Nội thất</Select.Option>
                            <Select.Option value="electronics">Đồ điện tử</Select.Option>
                            <Select.Option value="kitchenware">Đồ bếp</Select.Option>
                            <Select.Option value="books">Sách vở</Select.Option>
                            <Select.Option value="clothing">Quần áo</Select.Option>
                            <Select.Option value="other">Khác</Select.Option>
                        </Select>
                    </Form.Item>
                </Col>
            </Row>

            <Row gutter={16}>
                <Col span={12}>
                    <Form.Item name="condition" label="Tình trạng" rules={[{ required: true, message: 'Vui lòng chọn tình trạng' }]}>
                        <Select placeholder="Chọn tình trạng món đồ">
                            <Select.Option value="new">Mới 100%</Select.Option>
                            <Select.Option value="like_new">Như mới</Select.Option>
                            <Select.Option value="used">Đã qua sử dụng</Select.Option>
                        </Select>
                    </Form.Item>
                </Col>
                <Col span={12}>
                    <Form.Item name="listingType" label="Hình thức" rules={[{ required: true }]}>
                        <Radio.Group>
                            <Radio value="sell">Bán</Radio>
                            <Radio value="free">Cho tặng</Radio>
                            <Radio value="trade">Trao đổi</Radio>
                        </Radio.Group>
                    </Form.Item>
                </Col>
            </Row>

            <Form.Item name={['location', 'building']} label="Tòa nhà/Khu vực" rules={[{ required: true, message: 'Vui lòng nhập vị trí' }]}>
                <Input placeholder="Ví dụ: Tòa A, Chung cư Z" />
            </Form.Item>

            <Form.Item
                name="images"
                label="Hình ảnh"
                valuePropName="fileList"
                getValueFromEvent={normFile}
                rules={[{required: true, message: 'Vui lòng tải lên ít nhất một ảnh!'}]}
            >
                <Upload name="itemImages" action="/upload.do" listType="picture-card"
                        beforeUpload={() => false}>
                    <div>
                        <PlusOutlined/>
                        <div style={{marginTop: 8}}>Tải ảnh lên</div>
                    </div>
                </Upload>
            </Form.Item>

            <Form.Item className="text-right mt-4">
                <Space>
                    <Button onClick={onCancel} disabled={isLoading}>
                        Hủy
                    </Button>
                    <Button type="primary" htmlType="submit" loading={isLoading}>
                        {isEditMode ? 'Cập nhật' : 'Tạo mới'}
                    </Button>
                </Space>
            </Form.Item>
        </Form>
    )
}
export default ItemForm;