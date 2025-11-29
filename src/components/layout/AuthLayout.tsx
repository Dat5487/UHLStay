import { type ReactNode } from 'react';

interface AuthLayoutProps {
    children: ReactNode;
    imageUrl?: string;
}

const authImage = '/public/auth/auth_image.png';

const AuthLayout = ({ children }: AuthLayoutProps) => {
    return (
        <div className="min-h-screen flex">
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
                <div className="w-full max-w-md">
                    {children}
                </div>
            </div>

            <div className="hidden lg:flex w-1/2 items-center justify-center bg-gray-100 p-8">
                <div
                    className="w-full h-full bg-cover bg-center rounded-2xl shadow-lg"
                    style={{ backgroundImage: `url(${authImage})` }}
                />
            </div>
        </div>
    );
}
export default AuthLayout;