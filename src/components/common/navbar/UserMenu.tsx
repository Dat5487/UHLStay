import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Dropdown, Avatar } from 'antd';
import type { MenuProps } from 'antd';
import {
    HeartOutlined,
    UserOutlined,
    LogoutOutlined,
    AppstoreOutlined,
    CalendarOutlined,
} from '@ant-design/icons';
import {useAppSelector} from "../../../store/hooks.ts";
import {selectCurrentUser} from "../../../store/slices/authSlice.ts";
import {usePermissions} from "../../../hooks/usePermissions.ts";
import {useLogout} from "../../../hooks/useLogout.ts";

export const UserMenu = () => {
    const user = useAppSelector(selectCurrentUser);
    const { hasPermission } = usePermissions();
    const { logout } = useLogout();
    const userMenuItems = useMemo(() => {
        if (!user) return [];
        const baseItems: MenuProps['items'] = [
            {
                key: 'profile',
                label: <Link to="/profile">Hồ sơ của tôi</Link>,
                icon: <UserOutlined />
            },
            ...(user.role.name === 'renter' ? [{
                key: 'my-bookings',
                label: <Link to="/my-bookings">Đặt phòng của tôi</Link>,
                icon: <CalendarOutlined />
            }] : []),
            {
                key: 'my-saved',
                label: <Link to="/my-saved">Lưu trữ</Link>,
                icon: <HeartOutlined />
            },

        ];
        const adminItems: MenuProps['items'] = hasPermission('dashboard:view') ? [
            { type: 'divider' as const },
            { key: 'dashboard', label: <Link to="/admin/dashboard">Quản trị</Link>, icon: <AppstoreOutlined /> },
        ] : [];
        const logoutItem: MenuProps['items'] = [
            { type: 'divider' as const },
            {
                key: 'logout',
                label: 'Đăng xuất',
                icon: <LogoutOutlined />,
                danger: true,
                onClick: () => {
                    console.log('UserMenu: Logout clicked');
                    logout();
                }
            }
        ]

        return [...baseItems, ...adminItems, ...logoutItem];
    }, [user, hasPermission, logout]);
    if (!user) return null;


    return (
        <Dropdown menu={{ items: userMenuItems }} placement="bottomRight" arrow trigger={['click']}>
            <div className="flex items-center gap-2 cursor-pointer">
                <Avatar src={user.avatar} icon={<UserOutlined />} />
            </div>
        </Dropdown>
    );
}
