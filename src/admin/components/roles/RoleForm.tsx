import {Alert, Button, Form, type FormInstance, Input, Space, Spin, Transfer} from "antd";
import {useQuery} from "@tanstack/react-query";
import {fetchAllPermissions} from "../../../services/rbacApi.ts";
import {useEffect, useState} from "react";
import type {Role} from "../../../types";

interface RoleFormProps {
    form: FormInstance;
    initialValues?: Partial<Role> | null;
    onSubmit: (values: Omit<Role, 'id'>) => void;
    onCancel: () => void;
    isLoading: boolean;
    isEditMode: boolean;
}
const RoleForm = ({ form, initialValues, onSubmit, onCancel, isLoading, isEditMode }: RoleFormProps) => {
    const {data: allPermissions, isLoading: isLoadingPermissions, error} = useQuery({
        queryKey: ['admin_permissions'],
        queryFn: fetchAllPermissions,
    });

    const [targetKeys, setTargetKeys] = useState<string[]>([]);
    useEffect(() => {
        if (initialValues) {
            form.setFieldsValue(initialValues);
            setTargetKeys(initialValues.permissions || []);
        } else {
            form.resetFields();
            setTargetKeys([]);
        }
    }, [initialValues, form]);

    const handleTransferChange = (newTargetKeys: string[]) => {
        setTargetKeys(newTargetKeys);
        form.setFieldsValue({ permissions: newTargetKeys });
    };

    if (isLoadingPermissions) return <div className="text-center p-10"><Spin /></div>;
    if (error) return <Alert message="Lỗi tải danh sách" type="error" />;

    return (
        <Form form={form} layout="vertical" onFinish={onSubmit} size="large">
            <Form.Item name="name" label="Tên vai trò" rules={[{ required: true, message: 'Vui lòng nhập tên vai trò' }]}>
                <Input placeholder="Ví dụ: moderator" disabled={isEditMode} />
            </Form.Item>
            <Form.Item name={"permissions"} label="Quyền hạn được gán" valuePropName="targetKeys" >
                <Transfer
                    dataSource={allPermissions?.map(p => ({ key: p.name, title: p.name, description: p.description }))}
                    targetKeys={targetKeys}
                    onChange={() => handleTransferChange}
                    render={item => item.title}
                    listStyle={{ width: '100%', height: 350 }}
                    titles={['Các quyền có sẵn', 'Các quyền đã cấp']}
                    showSearch
                />
            </Form.Item>

            <Form.Item className="text-right mt-6">
                <Space>
                    <Button onClick={onCancel} disabled={isLoading}>Hủy</Button>
                    <Button type="primary" htmlType="submit" loading={isLoading}>
                        {isEditMode ? 'Cập nhật' : 'Tạo mới'}
                    </Button>
                </Space>
            </Form.Item>
        </Form>
    );
};

export default RoleForm;