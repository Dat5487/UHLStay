import {Button, Popconfirm, Space, Table, type TableProps} from "antd";
import {DeleteOutlined, EditOutlined} from "@ant-design/icons";

interface AdminTableProps<T extends { id: string | number }> {
    columns: TableProps<T>['columns'] | undefined;
    dataSource?: T[];
    isLoading: boolean;
    onEdit: (record: T) => void;
    onDelete: (id: T['id']) => void;
    paginationConfig: TableProps<T>['pagination'];
}

const AdminTable = <T extends { id: string | number }>({
                                                               columns,
                                                               dataSource,
                                                               isLoading,
                                                               onEdit,
                                                               onDelete,
                                                               paginationConfig,
                                                           }: AdminTableProps<T>) => {

    const actionColumn: TableProps<T>['columns'] = [
        {
            title: 'Hành động',
            key: 'action',
            align: 'center',
            width: 120,
            render: (_, record: T) => (
                <Space>
                    <Button icon={<EditOutlined />} onClick={() => onEdit(record)} />
                    <Popconfirm
                        title="Bạn chắc chắn muốn xóa?"
                        onConfirm={() => onDelete(record.id)}
                        okText="Xóa"
                        cancelText="Hủy"
                    >
                        <Button icon={<DeleteOutlined />} danger />
                    </Popconfirm>
                </Space>
            ),
        },
    ];
    const tableColumns = [...columns!, ...actionColumn];

    return (
        <Table
            dataSource={dataSource}
            columns={tableColumns}
            rowKey="id"
            loading={isLoading}
            pagination={paginationConfig}
            scroll={{ x: true }}
            bordered
        />
    );
};

export default AdminTable;
