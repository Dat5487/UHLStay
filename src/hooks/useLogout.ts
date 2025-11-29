import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useAppDispatch } from '../store/hooks';
import { logoutUser } from '../store/slices/authSlice';
import { useNavigate } from 'react-router-dom';
import { notification } from 'antd';

export const useLogout = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const logoutMutation = useMutation({
        mutationFn: async () => {
            // Clear localStorage
            localStorage.removeItem('currentUserId');
            
            // Clear React Query cache
            queryClient.clear();
            
            // Dispatch Redux logout
            dispatch(logoutUser());
            
            return true;
        },
        onSuccess: () => {
            notification.info({ message: 'Bạn đã đăng xuất.' });
            navigate('/login');
        },
        onError: (error) => {
            console.error('Logout error:', error);
            notification.error({ message: 'Lỗi khi đăng xuất' });
        }
    });

    return {
        logout: logoutMutation.mutate,
        isLoggingOut: logoutMutation.isPending
    };
};
