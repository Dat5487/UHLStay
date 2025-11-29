import {useAppDispatch, useAppSelector} from "../../store/hooks.ts";
import {Link, useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";
import type {LoginCredentials} from "../../types";
import {loginUser, resetAuthStatus, selectCurrentUser, selectIsAuthenticated} from "../../store/slices/authSlice.ts";
import {Alert, Button, Form, Input, Typography} from "antd";
import {LockOutlined, UserOutlined, MailOutlined, ArrowLeftOutlined} from "@ant-design/icons";
import AuthLayout from "../../components/layout/AuthLayout.tsx";

const {Title, Paragraph} = Typography;

const LoginPage = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { status, error } = useAppSelector(state => state.auth);
    const isAuthenticated = useAppSelector(selectIsAuthenticated);
    const user = useAppSelector(selectCurrentUser);
    const [showForgotPassword, setShowForgotPassword] = useState(false);

    useEffect(() => {
        console.log('LoginPage: Auth state changed', { isAuthenticated, user: !!user, status });
        // Only redirect if user is actually authenticated (not just status succeeded)
        if (isAuthenticated && user) {
            console.log('LoginPage: Redirecting to home');
            navigate('/');
            dispatch(resetAuthStatus()); // Reset status sau khi xử lý xong
        }
    }, [isAuthenticated, user, navigate, dispatch]);

    const onFinish = (values: LoginCredentials) => {
        dispatch(loginUser(values));
    };

    const onForgotPasswordFinish = (values: { email: string }) => {
        // This would typically call an API to send reset password email
        console.log('Forgot password for:', values.email);
        // For demo purposes, just show success and go back to login
        setShowForgotPassword(false);
    };

    const renderLoginForm = () => (
        <>
            <Title level={2} className="text-center">Chào mừng trở lại!</Title>
            <Paragraph className="text-center text-gray-500 mb-8">
                Đăng nhập để tiếp tục với UniStay.
            </Paragraph>
            <Form name="login" onFinish={onFinish} size="large">
                <Form.Item name="email" rules={[{ required: true, type: 'email', message: 'Vui lòng nhập email hợp lệ!' }]}>
                    <Input prefix={<UserOutlined />} placeholder="Email" />
                </Form.Item>
                <Form.Item name="password" rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!' }]}>
                    <Input.Password prefix={<LockOutlined />} placeholder="Mật khẩu" />
                </Form.Item>

                <Form.Item>
                    {status === 'failed' && error && (
                        <Alert message={error} type="error" showIcon closable />
                    )}
                </Form.Item>

                <Form.Item>
                    <Button type="primary" htmlType="submit" className="w-full" loading={status === 'loading'}>
                        Đăng nhập
                    </Button>
                </Form.Item>
                
                <div className="text-center mb-4">
                    <Typography.Text type="secondary">
                        <Link
                            onClick={() => setShowForgotPassword(true)}
                            className="font-semibold text-blue-600 hover:text-blue-700" to={""}                        >
                            Quên mật khẩu?
                        </Link>
                    </Typography.Text>
                </div>
                
                <div className="text-center">
                    <Typography.Text type="secondary">
                        Chưa có tài khoản? <Link to="/register" className="font-semibold text-blue-600">Đăng ký ngay!</Link>
                    </Typography.Text>
                </div>
            </Form>
        </>
    );

    const renderForgotPasswordForm = () => (
        <>
            <Title level={2} className="text-center">Quên mật khẩu</Title>
            <Paragraph className="text-center text-gray-500 mb-8">
                Nhập email của bạn để nhận link đặt lại mật khẩu.
            </Paragraph>
            <Form name="forgotPassword" onFinish={onForgotPasswordFinish} size="large">
                <Form.Item name="email" rules={[{ required: true, type: 'email', message: 'Vui lòng nhập email hợp lệ!' }]}>
                    <Input prefix={<MailOutlined />} placeholder="Email" />
                </Form.Item>

                <Form.Item>
                    <Button type="primary" htmlType="submit" className="w-full">
                        Gửi link đặt lại mật khẩu
                    </Button>
                </Form.Item>
                
                <div className="text-center">
                    <Typography.Text type="secondary">
                        <Link
                            onClick={() => setShowForgotPassword(false)}
                            className="font-semibold text-blue-600 hover:text-blue-700" to={""}                       >
                            <ArrowLeftOutlined /> Quay lại đăng nhập
                        </Link>
                    </Typography.Text>
                </div>
            </Form>
        </>
    );

    return (
        <AuthLayout imageUrl="https://source.unsplash.com/random/1200x900?login,modern">
            {showForgotPassword ? renderForgotPasswordForm() : renderLoginForm()}
        </AuthLayout>
    );
}

export default LoginPage;