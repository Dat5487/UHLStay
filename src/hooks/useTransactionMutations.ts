import {notification} from "antd";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import {markPayoutAsPaid} from "../services/bookingApi.ts";

export const useTransactionMutations = () => {
    const queryClient = useQueryClient();

    const { mutate: markAsPaid, isPending: isLoading } = useMutation({
        mutationFn: markPayoutAsPaid,
        onSuccess: () => {
            notification.success({ message: 'Cập nhật thành công!' });
            queryClient.invalidateQueries({ queryKey: ['pendingPayouts'] });
        },
        onError: (error: Error) => notification.error({ message: 'Có lỗi xảy ra', description: error.message }),
    });

    return { markAsPaid, isLoading };
};