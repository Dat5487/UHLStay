import {useMemo, useState} from 'react';
import {Link, useLocation, useNavigate} from 'react-router-dom';
import {Button, Input, Space, Dropdown, Badge, type MenuProps, Modal, Drawer, Popover} from 'antd';
import {
    FormOutlined, SearchOutlined, MenuOutlined, HeartFilled, MessageOutlined
} from '@ant-design/icons';
import {selectCurrentUser, selectIsAuthenticated} from '../../store/slices/authSlice';
import {useAppSelector} from "../../store/hooks.ts";
import {Header} from "antd/es/layout/layout";
import {selectPinnedItems} from "../../store/slices/userActionSlice.ts";
import {UserMenu} from "../common/navbar/UserMenu.tsx";
import {usePermissions} from "../../hooks/usePermissions.ts";
import {fetchConversations} from "../../services/messengerApi.ts";
import {useQuery} from '@tanstack/react-query';
import MessageContent from "../message/MessageContent.tsx";

const {Search} = Input;


export function Navbar() {
    const navigate = useNavigate();
    const isAuthenticated = useAppSelector(selectIsAuthenticated);
    const user = useAppSelector(selectCurrentUser);
    const location = useLocation();
    const {hasPermission} = usePermissions();

    const [isDrawerOpen, setDrawerOpen] = useState(false);
    const [isSearchModalOpen, setSearchModalOpen] = useState(false);
    const [popoverOpen, setPopoverOpen] = useState(false);

    const {data: conversations} = useQuery({
        queryKey: ['conversations'],
        queryFn: fetchConversations,
        refetchInterval: 30000,
    });


    const totalUnreadCount = useMemo(() => {
        return conversations?.reduce((sum, conv) => sum + conv.unreadCount, 0) || 0;
    }, [conversations]);

    const pinnedData = useAppSelector(selectPinnedItems);

    const navLinks = [
        {key: 'motels', href: '/motels', label: 'Phòng trọ'},
        {key: 'items', href: '/items', label: 'Chợ đồ cũ'},
        {key: 'blogs', href: '/blogs', label: 'Bài viết'},
    ];

    const {totalPinnedCount, pinnedMenuItems} = useMemo(() => {
        if (!pinnedData) return {totalPinnedCount: 0, pinnedMenuItems: []};
        const total = pinnedData.motels.length + pinnedData.items.length + pinnedData.posts.length;
        const items: MenuProps['items'] = [];
        if (pinnedData.motels.length > 0) {
            items.push({
                type: 'group',
                label: `Phòng trọ đã lưu (${pinnedData.motels.length})`,
                children: pinnedData.motels.map((id: string) => ({
                    key: `/motels/${id}`,
                    label: `Phòng trọ ID: ${id}`,
                })),
            });
        }
        if (pinnedData.items.length > 0) {
            items.push({
                type: 'group',
                label: `Đồ cũ đã ghim (${pinnedData.items.length})`,
                children: pinnedData.items.map((id: string) => ({
                    key: `/items/${id}`,
                    label: `Sản phẩm ID: ${id}`,
                })),
            });
        }

        if (pinnedData.posts.length > 0) {
            items.push({
                type: 'group',
                label: `Bài viết đã lưu (${pinnedData.posts.length})`,
                children: pinnedData.posts.map((id: string) => ({
                    key: `/blogs/post-id-${id}`, // Giả sử link blog
                    label: `Bài viết ID: ${id}`,
                })),
            });
        }
        if (total > 0) {
            items.push({type: 'divider'}); // Đường kẻ ngang phân cách
            items.push({
                key: '/my-saved',
                label: <strong className="text-blue-600">Xem tất cả tin đã lưu</strong>,
            });
        }

        return {
            totalPinnedCount: total,
            pinnedMenuItems: items
        };
    }, [pinnedData]);

    const handleMenuClick: MenuProps['onClick'] = (e) => {
        navigate(e.key);
    };

    const LoggedInActions = () => (
        <Space size="middle" align="center">
            <div className={"gap-4 flex flex-wrap"}>
                {renderContextualPostButton()}
            </div>
            <Popover
                content={<MessageContent/>}
                trigger="click"
                open={popoverOpen}
                onOpenChange={setPopoverOpen}
                placement="bottomRight"
                arrow={false}

            >
                <Badge count={totalUnreadCount} size="small">
                    <Button shape="circle" icon={<MessageOutlined/>}/>
                </Badge>
            </Popover>
            <div className={"flex flex-warp gap-4"}>
                <Dropdown
                    menu={{items: pinnedMenuItems, onClick: handleMenuClick}}
                    placement="bottomRight"
                    arrow
                    trigger={['click']}
                    disabled={totalPinnedCount === 0}
                >
                    <Badge count={totalPinnedCount} size="small">
                        <Button
                            shape="circle"
                            icon={<HeartFilled style={{color: totalPinnedCount > 0 ? '#eb2f96' : undefined}}/>}
                            title="Tin đã lưu"
                        />
                    </Badge>
                </Dropdown>

                <UserMenu/>
            </div>
        </Space>
    );

    const LoggedOutActions = () => (
        <Space>
            <Button type="default" onClick={() => navigate('/login')}>Đăng nhập</Button>
            <Button type="primary" onClick={() => navigate('/register')}>Đăng ký</Button>
        </Space>
    );

    const renderContextualPostButton = () => {

        const currentPath = location.pathname;

        if (currentPath.startsWith('/motels') && user && hasPermission('motel:create')) {
            return (
                <Button type="primary" icon={<FormOutlined/>} onClick={() => navigate('/motels/create-motel')}>
                    Thêm trọ
                </Button>
            );
        }

        if (currentPath.startsWith('/items') && hasPermission('item:create')) {
            return (
                <Button type="primary" icon={<FormOutlined/>} onClick={() => navigate('/items/create-item')}>
                    Thêm đồ cũ
                </Button>
            );
        }

        if (currentPath.startsWith('/blogs') && hasPermission('post:create')) {
            return (
                <Button type="primary" icon={<FormOutlined/>} onClick={() => navigate('/blogs/create-post')}>
                    Thêm bài viết
                </Button>
            )
        }
        return null;
    };

    const handleGlobalSearch = (value: string) => {
        const query = value.trim();
        if (query) {
            navigate(`/motels?keyword=${encodeURIComponent(query)}`);
        } else {
            navigate('/motels');
        }
    };

    return (
        <>
            <Header className="!bg-white shadow-sm sticky top-0 z-50 px-4 sm:px-6 lg:px-8 !h-auto flex flex-col">
                {/*Upper nav*/}
                <div className="w-full h-16 flex items-center justify-between">
                <div className="flex items-center gap-2 sm:gap-4">
                    <Link to="/" className="text-2xl font-bold text-blue-600">
                        <img 
                            src={"/logofont.png"} 
                            alt="Logo" 
                            className="w-20 sm:w-24 md:w-28 lg:w-32 xl:w-40 h-auto max-w-full object-contain mt-2 sm:mt-4"
                        />
                    </Link>
                </div>


                    <div className="hidden lg:flex flex-grow max-w-xl mx-8 ">
                        <Search placeholder="Tìm kiếm phòng trọ..." enterButton size="large"
                                onSearch={handleGlobalSearch}/>
                    </div>

                    <div className="flex items-center gap-2">
                        {/* Desktop icons*/}
                        <div className="hidden md:flex">

                            {isAuthenticated && user ? <LoggedInActions/> : <LoggedOutActions/>}
                        </div>
                        {/* Mobile icons */}
                        <Button className="lg:!hidden" type="text" shape="circle" icon={<SearchOutlined/>}
                                onClick={() => setSearchModalOpen(true)}/>
                        <Button className="md:!hidden" type="text" shape="circle" icon={<MenuOutlined/>}
                                onClick={() => setDrawerOpen(true)}/>
                    </div>
                </div>

                {/* Bottom nav*/}
                <div
                    className="w-full h-10 hidden md:flex items-center justify-center space-x-6 divide-x divide-blue-600">
                    {navLinks.map(link => (
                        <Link key={link.key} to={link.href}
                              className="text-base !text-black font-medium hover:text-blue-600 pe-[1.2rem]">
                            {link.label}
                        </Link>
                    ))}
                </div>
            </Header>

            <Modal
                title="Tìm kiếm"
                open={isSearchModalOpen}
                onCancel={() => setSearchModalOpen(false)}
                footer={null}
            >
                <Search
                    placeholder="Tìm kiếm mọi thứ bạn cần..."
                    enterButton="Tìm"
                    size="large"
                    onSearch={(value) => {
                        handleGlobalSearch(value);
                        setSearchModalOpen(false);
                    }}
                />
            </Modal>

            {/* Drawer cho mobile menu*/}
            <Drawer
                title="Menu"
                placement="left"
                onClose={() => setDrawerOpen(false)}
                open={isDrawerOpen}
            >
                <div className="flex flex-col gap-4">
                    {navLinks.map(link => (
                        <Link
                            key={link.key}
                            to={link.href}
                            className="text-lg text-gray-700 hover:text-blue-600 p-2 rounded"
                            onClick={() => setDrawerOpen(false)}
                        >
                            {link.label}
                        </Link>
                    ))}
                    <div className="border-t pt-4 !mt-4">
                        {isAuthenticated && user ? <LoggedInActions/> : <LoggedOutActions/>}
                    </div>
                </div>
            </Drawer>
        </>
    );
}