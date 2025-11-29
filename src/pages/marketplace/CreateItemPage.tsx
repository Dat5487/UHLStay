import {
    Button,
    Card,
    Col,
    Form,
    Input,
    InputNumber,
    message,
    Radio,
    Row,
    Select,
    Typography,
    Upload,
    type UploadFile
} from "antd";
import type {Item} from "../../types";
import {useNavigate} from "react-router-dom";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import {useAppSelector} from "../../store/hooks.ts";
import {selectCurrentUser} from "../../store/slices/authSlice.ts";
import {createItem} from "../../services/marketApi.ts";
import {PlusOutlined} from "@ant-design/icons";
import {convertUploadFilesToBase64} from "../../utils/imageConverter.ts";

const {Title} = Typography;
const {TextArea} = Input;
type CreateItemData = Omit<Item, 'id' | 'createdAt' | 'seller'>;
type ItemFormValues = Omit<CreateItemData, 'images'> & {
    images?: UploadFile[];
}

// Helper function xử lý giá trị trả về từ Upload component
const normFile = (e: any) => {
    if (Array.isArray(e)) {
        return e;
    }
    return e?.fileList;
};

const CreateItemPage = () => {
    const [form] = Form.useForm<ItemFormValues>();
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const currentUser = useAppSelector(selectCurrentUser);

    const {mutate: postItem, isPending} = useMutation({
        mutationFn: (values: CreateItemData) => createItem(values, {
            id: currentUser!.id,
            name: currentUser!.fullName,
            avatar: currentUser!.avatar || '',
        }),
        onSuccess: (newItem) => {
            message.success('Đăng tin thành công!');
            queryClient.invalidateQueries({queryKey: ['items']});
            navigate(`/items/${newItem.id}`);
        },
        onError: (error) => message.error(error.message),
    });
    const onFinish = async (values: ItemFormValues) => {
        const fileList = values.images || [];

        if (fileList.length === 0) {
            message.error('Vui lòng tải lên ít nhất một ảnh!');
            return;
        }

        try {
            const base64Images = await convertUploadFilesToBase64(fileList);

            const finalValues: CreateItemData = {
                ...values,
                images: base64Images,
            };

            postItem(finalValues);
        } catch (error) {
            console.error("Lỗi khi xử lý ảnh:", error);
        }
    };
    return (
        <div className="w-full max-w-4xl mx-auto">
            <Card>
                <Title level={2} className="text-center mb-8">Đăng tin đồ cũ</Title>
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={onFinish}
                    size="large"
                >
                    <Form.Item name="title" label="Tiêu đề tin đăng"
                               rules={[{required: true, message: 'Vui lòng nhập tiêu đề!'}]}>
                        <Input placeholder="Ví dụ: Pass lại bàn làm việc gỗ thông còn mới 99%"/>
                    </Form.Item>
                    <Form.Item name="description" label="Mô tả chi tiết"
                               rules={[{required: true, message: 'Vui lòng nhập mô tả!'}]}>
                        <TextArea rows={5} placeholder="Mô tả tình trạng, kích thước, lý do pass lại..."/>
                    </Form.Item>

                    {/* Sắp xếp layout với Row và Col cho gọn gàng */}
                    <Row gutter={24}>
                        <Col xs={24} sm={12}>
                            <Form.Item name="price" label="Giá mong muốn (VNĐ)"
                                       rules={[{required: true, message: 'Vui lòng nhập giá!'}]}>
                                <InputNumber className="w-full" min={0} step={10000}
                                             formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}/>
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={12}>
                            <Form.Item name="category" label="Danh mục"
                                       rules={[{required: true, message: 'Vui lòng chọn danh mục!'}]}>
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
                        <Col xs={24} sm={12}>
                            {/* THÊM MỚI: Form.Item cho 'condition' (Tình trạng) */}
                            <Form.Item name="condition" label="Tình trạng"
                                       rules={[{required: true, message: 'Vui lòng chọn tình trạng!'}]}>
                                <Select placeholder="Chọn tình trạng món đồ">
                                    <Select.Option value="new">Mới 100%</Select.Option>
                                    <Select.Option value="like_new">Như mới (đã dùng ít)</Select.Option>
                                    <Select.Option value="used">Đã qua sử dụng</Select.Option>
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={12}>
                            {/* THÊM MỚI: Form.Item cho 'listingType' (Hình thức) */}
                            <Form.Item name="listingType" label="Hình thức" rules={[{required: true}]}
                                       initialValue="sell">
                                <Radio.Group>
                                    <Radio value="sell">Bán</Radio>
                                    <Radio value="free">Cho tặng</Radio>
                                    <Radio value="trade">Trao đổi</Radio>
                                </Radio.Group>
                            </Form.Item>
                        </Col>
                        <Col span={24}>
                            {/* THÊM MỚI: Form.Item cho 'location' */}
                            <Form.Item name={['location', 'building']} label="Tòa nhà/Khu vực"
                                       rules={[{required: true, message: 'Vui lòng nhập vị trí!'}]}>
                                <Input placeholder="Ví dụ: Tòa A, Khu trọ Z"/>
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
                    </Row>

                    <Form.Item>
                        <Button type="primary" htmlType="submit" loading={isPending} block size="large">
                            Đăng tin
                        </Button>
                    </Form.Item>
                </Form>
            </Card>
        </div>
    );
}
export default CreateItemPage;

