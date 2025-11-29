import {useAppDispatch, useAppSelector} from "../../store/hooks.ts";
import {Link, useNavigate} from "react-router-dom";
import {registerUser, resetAuthStatus} from "../../store/slices/authSlice.ts";
import type {RegisterFormData} from "../../types";
import {useEffect, useState} from "react";
import {Button, Form, message, Steps, Typography} from "antd";
import Title from "antd/es/typography/Title";
import AuthLayout from "../../components/layout/AuthLayout.tsx";
import Verify_Account from "../../components/auth/register/Verify_Account.tsx";
import Verify_Personal from "../../components/auth/register/Verify_Personal.tsx";
import Verify_Confirm from "../../components/auth/register/Verify_Confirm.tsx";

const {Paragraph} = Typography;

const RegisterPage = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { status, error } = useAppSelector(state => state.auth);

    const [currentStep, setCurrentStep] = useState(0);
    const [formData, setFormData] = useState<Partial<RegisterFormData>>({});

    const [formStep1] = Form.useForm();
    const [formStep2] = Form.useForm();

    const steps = [
        { title: 'Tài khoản' },
        { title: 'Thông tin cá nhân' },
        { title: 'Hoàn tất' },
    ];

    const handleNext = async () => {
        try {
            let currentValues = {};
            if (currentStep === 0) {
                currentValues = await formStep1.validateFields();
            } else if (currentStep === 1) {
                currentValues = await formStep2.validateFields();
            }
            setFormData(prev => ({ ...prev, ...currentValues }));
            setCurrentStep(currentStep + 1);
        } catch (errorInfo) {
            console.log('Validation Failed:', errorInfo);
            message.error('Vui lòng điền đầy đủ thông tin!');
        }
    };

    const handlePrev = () => {
        setCurrentStep(currentStep - 1);
    };

    const handleRegister = () => {
        dispatch(registerUser(formData as RegisterFormData));
    };

    useEffect(() => {
        if (status === 'succeeded') {
            message.success('Đăng ký thành công! Đang chuyển hướng...');
            setTimeout(() => {
                navigate('/');
                dispatch(resetAuthStatus()); // Reset status sau khi xử lý xong
            }, 1000);
        }

        if (status === 'failed' && error) {
            message.error(error);
            dispatch(resetAuthStatus()); // Reset status sau khi hiển thị lỗi
        }
    }, [status, error, navigate, dispatch]);



    return (
        <AuthLayout imageUrl="https://source.unsplash.com/random/1200x900?signup,community">
            <Title level={2} className="text-center">Tạo tài khoản mới</Title>
            <Paragraph className="text-center text-gray-500 mb-6">
                Tham gia cộng đồng UniStay ngay hôm nay!
            </Paragraph>

            <Steps current={currentStep} className="mb-8" size="small">
                {steps.map(item => <Steps.Step key={item.title} title={item.title} />)}
            </Steps>

            <div className="min-h-[250px] mt-8">
                {currentStep === 0 && <Verify_Account form={formStep1} />}
                {currentStep === 1 && <Verify_Personal form={formStep2} />}
                {currentStep === 2 && <Verify_Confirm formData={formData} />}
            </div>


            <div className="flex justify-end space-x-2 mt-6">
                {currentStep > 0 && (
                    <Button type="default" onClick={handlePrev}>Trở lại</Button>
                )}
                {currentStep < steps.length - 1 && (
                    <Button type="primary" onClick={handleNext}>Tiếp tục</Button>
                )}
                {currentStep === steps.length - 1 && (
                    <Button type="primary" onClick={handleRegister}>Đăng ký</Button>
                )}
            </div>

            <div className="text-center mt-6">
                <Typography.Text type="secondary">
                    Đã có tài khoản? <Link to="/login" className="font-semibold text-blue-600">Đăng nhập</Link>
                </Typography.Text>
            </div>
        </AuthLayout>
    )
}
export default RegisterPage;