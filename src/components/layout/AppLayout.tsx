import { Layout } from 'antd';
import { Outlet } from 'react-router-dom'; // Import Outlet
import { Navbar } from './Navbar';
import Footer from "./Footer.tsx";

const { Header, Content } = Layout;

export function AppLayout() {
    return (
        <Layout style={{ minHeight: '100vh' }}>
            <Header>
                <Navbar />
            </Header>
            <Content style={{ padding: '24px 4px' }}>
                <div style={{ background: '#fff', padding: 24, borderRadius: '8px' }}>
                    <Outlet />
                </div>
            </Content>
            <Footer/>
        </Layout>
    );
}