import { useMutation, useQueryClient } from '@tanstack/react-query';
import { approveMotel, rejectMotel } from '../services/motelApi';
import { notification } from 'antd';

export const useMotelMutations = () => {
    const queryClient = useQueryClient();

    const mutationOptions = {
        onSuccess: () => {
            notification.success({ message: 'Thao tác thành công!' });
            queryClient.invalidateQueries({ queryKey: ['pendingMotels'] });
        },
        onError: (error: Error) => notification.error({ message: 'Thao tác thất bại', description: error.message }),
    };

    const approveMutation = useMutation({ mutationFn: approveMotel, ...mutationOptions });
    const rejectMutation = useMutation({ mutationFn: rejectMotel, ...mutationOptions });

    return {
        approveMotel: approveMutation.mutate,
        rejectMotel: rejectMutation.mutate,
        isLoading: approveMutation.isPending || rejectMutation.isPending,
    };
};