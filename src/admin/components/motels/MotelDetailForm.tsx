import React, { useEffect } from 'react';
import {Modal, Form, Input, InputNumber, Row, Col, Skeleton, Alert, Select, Checkbox, Upload} from 'antd';
import { useQuery } from '@tanstack/react-query';
import type {Motel} from "../../../types";
import {fetchMotelById} from "../../../services/motelApi.ts";
import {PlusOutlined} from "@ant-design/icons";


interface MotelDetailFormProps {
    motelId: string | null;
    open: boolean;
    onClose: () => void;
    onUpdate?: (values: Partial<Motel>) => void;
}
const normFile = (e: any) => {
    if (Array.isArray(e)) {
        return e;
    }
    return e?.fileList;
};
const status = ["published", "pending", "draft", "rented"];

const MotelDetailForm: React.FC<MotelDetailFormProps> = ({ motelId, open, onClose, onUpdate }) => {
    const [form] = Form.useForm();

    const { data: motel, isLoading, isError, error } = useQuery({
        queryKey: ['motel', motelId],
        queryFn: () => fetchMotelById(motelId!),
        enabled: !!motelId,
    });

    useEffect(() => {
        if (motel) {
            form.setFieldsValue({
                ...motel,
                price: motel.price.value
            });
        }
    }, [motel, form]);

    // Unistay - Chất lượng cuộc sống - Nâng tầm trài nghiệm

    const handleOk = () => {
        form.validateFields().then(values => {
            console.log("Form values:", values);
            // Gọi hàm onUpdate nếu có
            if (onUpdate) {
                const updatedData = { ...values, price: { value: values.price, unit: 'tháng' } };
                onUpdate(updatedData);
            }
            onClose();
        });
    };

    return (
        <Modal
            title="Chi tiết Tin đăng"
            open={open}
            onCancel={onClose}
            onOk={handleOk}
            okText="Lưu thay đổi"
            cancelText="Đóng"
            width={800}
        >
            {isLoading && <Skeleton active />}
            {isError && <Alert message="Lỗi tải dữ liệu" description={(error as Error).message} type="error" />}
            {motel && (
                <Form form={form} layout="vertical">
                    <Form.Item name="title" label="Tiêu đề tin đăng" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="description" label="Mô tả chi tiết">
                        <Input.TextArea rows={4} />
                    </Form.Item>
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item name={['price']} label="Giá (VNĐ/tháng)" rules={[{ required: true }]}>
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
                            <Form.Item name="status" label="Trạng thái">
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
                </Form>
            )}
        </Modal>
    );
};

export default MotelDetailForm;