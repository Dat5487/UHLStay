import {
    AppstoreOutlined,
    HomeOutlined,
    ReadOutlined, SafetyCertificateOutlined,
    TeamOutlined
} from '@ant-design/icons';
import {PERMISSIONS} from "./permissions.ts";

export const adminMenuItems = [
    {
        key: '/admin/dashboard',
        icon: <AppstoreOutlined/>,
        label: 'Dashboard',
        requiredPermission: null,
    },
    {
        key: '/admin/motels',
        icon: <HomeOutlined/>,
        label: 'Quản lý phòng trọ',
        requiredPermission: PERMISSIONS.MANAGE.MOTEL,
    },
    {
        key: '/admin/items',
        icon: <ReadOutlined/>,
        label: 'Quản lý đồ cũ',
        requiredPermission: PERMISSIONS.MANAGE.ITEM,
    },
    {
        key: '/admin/posts',
        icon: <ReadOutlined/>,
        label: 'Quản lý Blog',
        requiredPermission: PERMISSIONS.MANAGE.POST,
    },
    {
        key: '/admin/users',
        icon: <TeamOutlined/>,
        label: 'Quản lý người dùng',
        requiredPermission: PERMISSIONS.MANAGE.USER,
    },
    {
        key: '/admin/roles',
        icon: <TeamOutlined/>,
        label: 'Quản lý Vai trò',
        requiredPermission: PERMISSIONS.MANAGE.ROLE,
    },
    {
        key: '/admin/permissions',
        icon: <SafetyCertificateOutlined />,
        label: 'Quản lý Quyền hạn',
        requiredPermission: PERMISSIONS.MANAGE.PERMISSION,
    },
    {
        key: '/admin/rent-controls',
        icon: <TeamOutlined/>,
        label: 'Quản lý Đăng tin phòng',
        requiredPermission: PERMISSIONS.MANAGE.RENT_CONTROL,
    },
    {
        key: '/admin/booking',
        icon: <HomeOutlined/>,
        label: 'Quản lý Đặt phòng',
        requiredPermission: PERMISSIONS.MANAGE.BOOKING,
    }
];