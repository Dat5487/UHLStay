import { useEffect } from 'react';
import {Form, Input, Button, Space, InputNumber, Row, Col, Checkbox, Upload, Select, type UploadFile} from 'antd';
import type { FormInstance } from 'antd';
import type { Motel } from '../../../types';
import {PlusOutlined} from "@ant-design/icons";

type MotelFormValues = Omit<Motel, 'id' | 'createdAt' | 'images'> & {
    images?: UploadFile[];
};
const status = ["published", "pending", "draft", "rented"];

interface MotelFormProps {
    form: FormInstance;
    initialValues?: Partial<Motel> | null;
    onSubmit: (values: MotelFormValues) => void;
    onCancel: () => void;
    isLoading: boolean;
}
const normFile = (e: any) => {
    if (Array.isArray(e)) {
        return e;
    }
    return e?.fileList;
};
const MotelForm = ({ form, initialValues, onSubmit, onCancel, isLoading }: MotelFormProps) => {
    useEffect(() => {
        if (initialValues) {
            form.setFieldsValue(initialValues);
        } else {
            form.resetFields();
        }
    }, [initialValues, form]);

    return (
        <Form form={form} layout="vertical" onFinish={onSubmit}>
            <Form.Item name="title" label="Tiêu đề tin đăng" rules={[{ required: true }]}>
                <Input />
            </Form.Item>
            <Form.Item name="description" label="Mô tả chi tiết">
                <Input.TextArea rows={4} />
            </Form.Item>
            <Row gutter={16}>
                <Col span={12}>
                    <Form.Item name={['price', 'value']} label="Giá (VNĐ/tháng)" rules={[{ required: true }]}>
                        <InputNumber className="w-full" step={100000} formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')} />
                    </Form.Item>
                </Col>
                <Col span={12}>
                    <Form.Item name="area" label="Diện tích (m²)" rules={[{ required: true }]}>
                        <InputNumber className="w-full" />
                    </Form.Item>
                </Col>
                <Col span={12}>
                    <Form.Item name={['specs', 'capacity']} label="Số người ở" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                </Col>
                <Col span={12}>
                    <Form.Item name="city" label="Thành phố" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                </Col>
                <Col span={12}>
                    <Form.Item name="district" label="Quận/Huyện" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                </Col>
                <Col span={12}>
                    <Form.Item name="status" label="Trạng thái"
                               rules={[{required: true, message: 'Vui lòng chọn trạng thái!'}]}>
                        <Select placeholder="Chọn trạng thái">
                            {
                                status.map(s =>
                                    <Select.Option value={s}>{s}</Select.Option>
                                )
                            }
                        </Select>
                    </Form.Item>
                </Col>
            </Row>
            <Form.Item name="amenities" label="Tiện nghi">
                <Checkbox.Group options={['Full nội thất', 'Gần trường', 'Giờ giấc tự do', 'Điều hòa', 'Nóng lạnh', 'Wifi', "Chỗ để xe", "An ninh tốt"]} />
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
                    <Button onClick={onCancel} disabled={isLoading}>Hủy</Button>
                    <Button type="primary" htmlType="submit" loading={isLoading}>
                        Lưu thay đổi
                    </Button>
                </Space>
            </Form.Item>
        </Form>
    );
};

export default MotelForm;