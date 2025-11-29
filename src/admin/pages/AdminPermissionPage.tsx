import {useQuery} from "@tanstack/react-query";
import {fetchAllPermissions} from "../../services/rbacApi.ts";
import type {Permission} from "../../types";
import {Alert, Spin, Table, type TableProps, Tag, Typography} from "antd";
const {Title} = Typography;


const AdminPermissionPage = () => {
    const {data: permissions, isLoading, error} = useQuery({
        queryKey: ['all_permissions'],
        queryFn: fetchAllPermissions
    });


    const columns: TableProps<Permission>['columns'] = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
            width: 80,
        },
        {
            title: 'Tên quyền (Permission Name)',
            dataIndex: 'name',
            key: 'name',
            render: (name) => <Tag color="cyan">{name}</Tag>
        },
        {
            title: 'Mô tả',
            dataIndex: 'description',
            key: 'description',
        },
    ];
    if (isLoading) return <Spin fullscreen tip="Đang tải danh sách quyền..."/>;
    if (error) return <Alert message="Lỗi" description={(error as Error).message} type="error"/>;
    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <Title level={2} className="!m-0">Quản lý quyền hạn</Title>
            </div>
            <Table dataSource={permissions} columns={columns} rowKey="id" loading={isLoading} pagination={{
                pageSize: 10,
                showSizeChanger: true,
                showQuickJumper: true,
                position: ['bottomCenter'],
            }}/>
        </div>
    );

}
export default AdminPermissionPage;