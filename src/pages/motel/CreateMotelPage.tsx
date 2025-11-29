import type {Motel} from "../../types";
import {
    Button,
    Card,
    Checkbox,
    Col,
    Form,
    Input,
    InputNumber,
    message,
    Row,
    Select,
    Typography,
    Upload,
    type UploadFile
} from "antd";
import {useNavigate} from "react-router-dom";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import {createMotel} from "../../services/motelApi.ts";
import {PlusOutlined} from "@ant-design/icons";
import {convertUploadFilesToBase64} from "../../utils/imageConverter.ts";

const { Title } = Typography;
const {TextArea} = Input;

const normFile = (e: any) => {
    if (Array.isArray(e)) {
        return e;
    }
    return e?.fileList;
};

type CreateMotelData = Omit<Motel, 'id' | 'createdAt'>;
type MotelFormValues = Omit<CreateMotelData, 'images'> & {
    images?: UploadFile[];
};

const CreateMotelPage = () => {
    const [form] = Form.useForm<MotelFormValues>();
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const { mutate: postMotel, isPending } = useMutation({
        mutationFn: (values: CreateMotelData) => createMotel(values),
        onSuccess: (newlyCreatedMotel) => {
            message.success('Đăng tin thành công!');
            queryClient.invalidateQueries({ queryKey: ['motels'] });
            navigate(`/motels/${newlyCreatedMotel.id}`);
        },
        onError: (error) => {
            message.error(error.message);
        },
    });

    const onFinish = async (values: MotelFormValues) => {
        const fileList = values.images || [];

        if (fileList.length === 0) {
            message.error('Vui lòng tải lên ít nhất một ảnh!');
            return;
        }

        try {
            const base64Images = await convertUploadFilesToBase64(fileList);

            const finalValues: CreateMotelData = {
                ...values,
                images: base64Images,
            };

            postMotel(finalValues);
        } catch (error) {
            console.error("Lỗi khi xử lý ảnh:", error);
        }
    };

    const areaLists = ["Hà Nội", "Hải Phòng", "Quảng Ninh", "TP.HCM"]

    return (
        <div className="w-full mx-auto">
            <Card>
                <Title level={2} className="text-center">Tạo tin đăng mới</Title>
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={onFinish}
                    initialValues={{ city: 'Hà Nội' }}
                >
                    <Row gutter={24}>
                        <Col span={24}>
                            <Form.Item name="title" label="Tiêu đề tin đăng" rules={[{ required: true, message: 'Vui lòng nhập tiêu đề!' }]}>
                                <Input placeholder="Ví dụ: Phòng trọ khép kín full đồ gần Đại học Hạ Long" />
                            </Form.Item>
                        </Col>
                        <Col span={24}>
                            <Form.Item name="description" label="Mô tả chi tiết" rules={[{ required: true, message: 'Vui lòng nhập mô tả!' }]}>
                                <TextArea rows={6} placeholder="Mô tả về phòng, vị trí, tiện ích xung quanh..." />
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={12}>
                            <Form.Item name="city" label="Thành phố" rules={[{ required: true }]}>
                                <Select>
                                    {areaLists.map((area) => (
                                        <Select.Option key={area} value={area}>{area}</Select.Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={12}>
                            <Form.Item name="district" label="Quận/Huyện" rules={[{ required: true, message: 'Vui lòng chọn quận/huyện!' }]}>
                                <Input placeholder="Ví dụ: Phường Hạ Long" />
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={12}>
                            <Form.Item name="price" label="Giá cho thuê (VNĐ/tháng)" rules={[{ required: true, message: 'Vui lòng nhập giá cho thuê!' }]}>
                                <InputNumber className="w-full" step={100000} formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')} />
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={12}>
                            <Form.Item name="area" label="Diện tích (m²)" rules={[{ required: true, message: 'Vui lòng nhập diện tích!' }]}>
                                <InputNumber className="w-full" min={50} />
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={12}>
                            <Form.Item name="capacity" label="Số người ở" rules={[{ required: true, message: 'Vui lòng nhập số người ở!'}]}>
                                <InputNumber className="w-full" step={1} />
                            </Form.Item>
                        </Col>
                        <Col span={24}>
                            <Form.Item name="amenities" label="Tiện nghi">
                                <Checkbox.Group
                                    options={[
                                        { label: 'Điều hòa', value: 'Điều hòa' },
                                        { label: 'Nóng lạnh', value: 'Nóng lạnh' },
                                        { label: 'Ban công', value: 'Ban công' },
                                        { label: 'Full nội thất', value: 'Full nội thất' },
                                        { label: 'An ninh tốt', value: 'An ninh tốt' },
                                    ]}
                                />
                            </Form.Item>
                        </Col>
                        <Col span={24}>
                            <Form.Item
                                name="images"
                                label="Hình ảnh"
                                valuePropName="fileList"
                                getValueFromEvent={normFile}
                                rules={[{required: true, message: 'Vui lòng tải lên ít nhất một ảnh!'}]}
                            >
                                <Upload 
                                    name="itemImages" 
                                    listType="picture-card"
                                    beforeUpload={() => false}
                                    accept="image/*"
                                >
                                    <div>
                                        <PlusOutlined/>
                                        <div style={{marginTop: 8}}>Tải ảnh lên</div>
                                    </div>
                                </Upload>
                            </Form.Item>
                        </Col>
                        <Col span={24} className="text-right">
                            <Form.Item>
                                <Button type="primary" htmlType="submit" size="large" loading={isPending}>
                                    Đăng tin
                                </Button>
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
            </Card>
        </div>
    );
}
export default CreateMotelPage;