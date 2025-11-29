import {Route, Routes} from "react-router-dom";
import {AppLayout} from "./components/layout/AppLayout.tsx";
import MotelPage from "./pages/motel/MotelPage.tsx";
import LoginPage from "./pages/auth/LoginPage.tsx";
import HomePage from "./pages/HomePage.tsx";
import MarketPage from "./pages/marketplace/MarketPage.tsx";
import BlogPage from "./pages/blog/BlogPage.tsx";
import BlogPostPage from "./pages/blog/BlogPostPage.tsx";
import MotelDetailPage from "./pages/motel/MotelDetailPage.tsx";
import ItemDetailPage from "./pages/marketplace/ItemDetailPage.tsx";
import RegisterPage from "./pages/auth/RegisterPage.tsx";
import ProtectedRoute from "./components/common/ProtectedRoute.tsx";
import CreateMotelPage from "./pages/motel/CreateMotelPage.tsx";
import CreateItemPage from "./pages/marketplace/CreateItemPage.tsx";
import CreateBlogPage from "./pages/blog/CreateBlogPage.tsx";
import SplitLayout from "./components/layout/SplitLayout.tsx";
import ProfilePage from "./pages/auth/ProfilePage.tsx";
import DashboardPage from "./admin/pages/DashboardPage.tsx";
import AdminLayout from "./admin/layouts/AdminLayout.tsx";
import AdminUserPage from "./admin/pages/AdminUserPage.tsx";
import AdminMotelPage from "./admin/pages/AdminMotelPage.tsx";
import AdminMarketPage from "./admin/pages/AdminMarketPage.tsx";
import AdminBlogPage from "./admin/pages/AdminBlogPage.tsx";
import MySavedPage from "./pages/MySavedPage.tsx";
import AdminRolePage from "./admin/pages/AdminRolePage.tsx";
import AdminPermissionPage from "./admin/pages/AdminPermissionPage.tsx";
import AdminApprovalPage from "./admin/pages/AdminApprovalPage.tsx";
import BookingPage from "./pages/booking/BookingPage.tsx";
import MyBookingsPage from "./pages/booking/MyBookingsPage.tsx";
import AdminBookingPage from "./admin/pages/AdminBookingPage.tsx";
import { AuthInitializer } from "./components/common/AuthInitializer.tsx";


const App = () => {
    return (
        <>
            <AuthInitializer />
            <Routes>
            <Route path="login" element={<LoginPage/>}/>
            <Route path="register" element={<RegisterPage/>}/>
            <Route path="/" element={<AppLayout/>}>
                <Route path="profile" element={<ProfilePage/>}/>
                <Route path="/my-saved" element={<MySavedPage />} />

                <Route index element={<HomePage/>}/>

                <Route path="motels" element={<SplitLayout/>}>
                    <Route index element={<MotelPage/>}/>
                    <Route path=":motelId" element={<MotelDetailPage/>}/>
                    <Route element={<ProtectedRoute allowedRoles={['landlord', 'admin']}/>}>
                        <Route path="create-motel" element={<CreateMotelPage/>}/>
                    </Route>
                </Route>

                <Route path="items" element={<SplitLayout/>}>
                    <Route index element={<MarketPage/>}/>
                    <Route path=":itemId" element={<ItemDetailPage/>}/>
                    <Route path="create-item" element={<CreateItemPage/>}/>
                </Route>


                <Route path="blogs">
                    <Route index element={<BlogPage/>}/>
                    <Route path="create-post" element={<CreateBlogPage/>}/>
                    <Route path=":slug" element={<BlogPostPage/>}/>
                </Route>

                <Route element={<ProtectedRoute allowedRoles={['renter', 'admin']} />}>
                    <Route path="booking/:motelId" element={<BookingPage />} />
                    <Route path="my-bookings" element={<MyBookingsPage />} />
                </Route>
            </Route>
            <Route
                element={
                    <ProtectedRoute/>
                }
            >
                <Route element={<AdminLayout/>}>
                    <Route path="/admin/dashboard" element={<DashboardPage/>}/>
                    <Route path="/admin/users" element={<AdminUserPage/>}/>
                    <Route path="/admin/motels" element={<AdminMotelPage/>}/>
                    <Route path="/admin/items" element={<AdminMarketPage/>}/>
                    <Route path="/admin/posts" element={<AdminBlogPage/>}/>
                    <Route path="/admin/roles" element={<AdminRolePage />} />
                    <Route path="/admin/permissions" element={<AdminPermissionPage />} />
                    <Route path="/admin/rent-controls" element={<AdminApprovalPage/>}/>
                    <Route path="/admin/booking" element={<AdminBookingPage/>}/>
                </Route>

            </Route>
        </Routes>
        </>
    )
}
export default App;