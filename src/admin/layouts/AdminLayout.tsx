import {useCallback, useMemo, useState} from 'react';
import {Layout, Menu, Button, type MenuProps} from 'antd';
import {Outlet, useNavigate, useLocation} from 'react-router-dom';
import {
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    PushpinFilled,
    PushpinOutlined,
} from '@ant-design/icons';
import {useAppSelector} from "../../store/hooks.ts";
import {selectCurrentUser} from "../../store/slices/authSlice.ts";
import {adminMenuItems} from "../config/adminMenuConfig.tsx";
import Title from "antd/es/typography/Title";
import {UserMenu} from "../../components/common/navbar/UserMenu.tsx";

const { Sider, Content, Header } = Layout;

const AdminLayout = () => {
    const navigate = useNavigate();
    const user = useAppSelector(selectCurrentUser);
    const location = useLocation();


    const [isPinned, setIsPinned] = useState(false);
    const [collapsed, setCollapsed] = useState(true);

    const handleMouseEnter = () => {
        if (!isPinned) {
            setCollapsed(false);
        }
    };

    const handleMouseLeave = () => {
        if (!isPinned) {
            setCollapsed(true);
        }
    };

    const handlePinToggle = useCallback(() => {
        setIsPinned(prev => !prev);
    }, []);


    const accessibleMenuItems: MenuProps['items'] = useMemo(() => {
        return adminMenuItems.filter(item =>
            !item.requiredPermission || user?.permissions?.includes(item.requiredPermission)
        );
    }, [user?.permissions]);

    return (
        <Layout style={{ minHeight: '100vh' }}>
            <Sider
                theme="light"
                collapsible
                collapsed={collapsed}
                width={220}
                collapsedWidth={80}
                trigger={null}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                className="border-r border-gray-200 shadow-sm"
            >
                <div className="flex flex-col h-full justify-between">
                    {/* Phần trên: Logo và Menu */}
                    <div>
                        <div className="h-16 flex items-center justify-center font-bold text-xl text-blue-600">
                            {/* Hiển thị logo/tên đầy đủ */}
                            {(isPinned || !collapsed) ? 'UniStay Admin' : 'U'}
                        </div>
                        <Menu
                            theme="light"
                            mode="inline"
                            selectedKeys={[location.pathname]}
                            onClick={({ key }) => navigate(key)}
                            items={accessibleMenuItems}
                        />
                    </div>

                    <div className="p-2 border-t border-gray-200">
                        <Button
                            type="text"
                            icon={isPinned ? <PushpinFilled /> : <PushpinOutlined />}
                            onClick={handlePinToggle}
                            className="w-full !flex !items-center !justify-center"
                        >
                            {(!collapsed || isPinned) && (isPinned ? 'Bỏ ghim' : 'Ghim menu')}
                        </Button>
                    </div>
                </div>
            </Sider>

            <Layout>
                <Header className="bg-white p-0 px-6 flex items-center justify-between border-b">
                    <Button
                        type="text"
                        icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                        onClick={() => setCollapsed(!collapsed)}
                    />
                    <div className={"flex flex-warp gap-4"}>
                        <Title level={5} >Welcome back, {user && user.fullName}</Title>
                        <UserMenu />
                    </div>
                </Header>

                <Content className="p-6 bg-gray-100">
                    <Outlet />
                </Content>
            </Layout>
        </Layout>
    );
};

export default AdminLayout;