import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { notification } from 'antd';
import { apiGetCurrentUser, apiLogin, apiLogout, apiRegister } from '../services/authApi';

export const useAuth = () => {
    const queryClient = useQueryClient();
    const navigate = useNavigate();

    const { data: user, isLoading: isLoadingUser } = useQuery({
        queryKey: ['currentUser'],
        queryFn: apiGetCurrentUser,

        staleTime: 1000 * 60 * 15,
        refetchOnWindowFocus: false,
        retry: 1,
    });

    const { mutate: login, isPending: isLoggingIn } = useMutation({ // ✅ SỬA LỖI: Đổi `isLoading` thành `isPending`
        mutationFn: apiLogin,
        onSuccess: (loggedInUser) => {
            queryClient.setQueryData(['currentUser'], loggedInUser);
            notification.success({ message: `Chào mừng trở lại, ${loggedInUser.fullName}!` });
            navigate('/');
        },
        onError: (error: Error) => notification.error({ message: error.message }),
    });

    // 3. MUTATION: Xử lý đăng xuất
    const { mutate: logout, isPending: isLoggingOut } = useMutation({ // ✅ SỬA LỖI: Đổi `isLoading` thành `isPending`
        mutationFn: apiLogout,
        onSuccess: () => {
            queryClient.setQueryData(['currentUser'], null);
            queryClient.removeQueries();
            notification.info({ message: 'Bạn đã đăng xuất.' });
            navigate('/login');
        },
    });

    // 4. MUTATION: Xử lý đăng ký
    const { mutate: register, isPending: isRegistering } = useMutation({ // ✅ SỬA LỖI: Đổi `isLoading` thành `isPending`
        mutationFn: apiRegister,
        onSuccess: (newUser) => {
            localStorage.setItem('currentUserId', newUser.id);
            queryClient.setQueryData(['currentUser'], newUser);
            notification.success({ message: `Đăng ký thành công! Chào mừng ${newUser.fullName}!` });
            navigate('/');
        },
        onError: (error: Error) => notification.error({ message: error.message }),
    });

    /**
     * Hàm kiểm tra xem user hiện tại có một quyền cụ thể hay không.
     * @param requiredPermission - Quyền cần kiểm tra.
     * @returns {boolean} - True nếu user có quyền, ngược lại là false.
     */
    const hasPermission = (requiredPermission: string): boolean => {
        if (!user || !user.permissions) {
            return false;
        }
        return user.permissions.includes(requiredPermission);
    };

    return {
        user,
        isAuthenticated: !!user,
        isLoadingUser,
        hasPermission,

        login,
        isLoggingIn,

        logout,
        isLoggingOut,

        register,
        isRegistering,
    };
};