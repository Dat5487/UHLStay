import {useMutation, useQueryClient} from '@tanstack/react-query';
import {
    createBooking as createBookingApi,
    rejectBooking as rejectBookingApi,
    cancelBooking as cancelBookingApi,
    approveBooking as approveBookingApi,
    confirmDepositAndCreateTransaction as confirmDepositAndCreateTransactionApi,
} from '../services/bookingApi';
import {notification} from 'antd';
import { useAppSelector } from '../store/hooks';
import { selectCurrentUser } from '../store/slices/authSlice';
import type {Booking} from "../types";

export const useBookingMutations = () => {
    const queryClient = useQueryClient();
    const user = useAppSelector(selectCurrentUser);

    const mutationOptions = (successMsg: string) => ({
        onSuccess: () => {
            notification.success({message: successMsg});
            // Refresh renter
            queryClient.invalidateQueries({ queryKey: ['myBookings', user?.id] });

            // Refresh landlord and admin
            queryClient.invalidateQueries({ queryKey: ['landlordRequests'] });
            queryClient.invalidateQueries({ queryKey: ['adminPendingBookings'] });

        },
        onError: (error: Error) => notification.error({message: 'Thao tác thất bại', description: error.message}),
    });

    // 1. Tạo mới một đơn đặt phòng
    const {mutate: create, mutateAsync: createBookingAsync, isPending: isCreating} = useMutation({
        mutationFn: (data: Omit<Booking, 'id' | 'status' | 'createdAt' | 'updatedAt'>) => createBookingApi(data),
        onSuccess: () => {
            notification.success({message: 'Yêu cầu đặt phòng đã được gửi thành công!'});
            // Refresh renter bookings
            queryClient.invalidateQueries({queryKey: ['myBookings', user?.id]});
            // Refresh landlord and admin queries
            queryClient.invalidateQueries({ queryKey: ['landlordRequests'] });
            queryClient.invalidateQueries({ queryKey: ['adminPendingBookings'] });
        },
        onError: (error: Error) => {
            notification.error({message: 'Gửi yêu cầu thất bại', description: error.message});
        },
    });

    // 2. Chủ nhà chấp thuận
    const {mutate: approve, isPending: isApproving} = useMutation({
        mutationFn: approveBookingApi,
        ...mutationOptions('Đã chấp thuận yêu cầu.'),
    });

    // 3. Chủ nhà từ chối
    const {mutate: reject, isPending: isRejecting} = useMutation({
        mutationFn: rejectBookingApi,
        ...mutationOptions('Đã từ chối yêu cầu.')
    });

    // 4. Người dùng hủy
    const {mutate: cancel, isPending: isCancelling} = useMutation({
        mutationFn: cancelBookingApi,
        ...mutationOptions('Đã hủy yêu cầu đặt phòng.'),
    });

    // 5. Người dùng thanh toán cọc
    const {mutate: confirmDeposit, isPending: isConfirming} = useMutation({
        mutationFn: confirmDepositAndCreateTransactionApi,
        ...mutationOptions('Thanh toán cọc và xác nhận thành công!'),
    });


    return {
        create,
        createBookingAsync,
        isCreating,
        approve,
        isApproving,
        reject,
        isRejecting,
        cancel,
        isCancelling,
        confirmDeposit,
        isConfirming,
    };
};