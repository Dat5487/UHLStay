// src/services/bookingApi.ts
import {v4 as uuidv4} from 'uuid';
import type {Booking, PopulatedBooking, PopulatedTransaction, Transaction} from '../types';
import {allMotels, updateMotel} from './motelApi';
import {mockUsers} from './authApi';

const BOOKINGS_STORAGE_KEY = import.meta.env.VITE_BOOKINGS_STORAGE_KEY || 'unistay_mock_bookings_default';

const getBookingsFromStorage = (): Booking[] => {
    try {
        const data = localStorage.getItem(BOOKINGS_STORAGE_KEY);
        if (data) {
            const bookings = JSON.parse(data).map((booking: Booking) => ({
                ...booking,
                createdAt: new Date(booking.createdAt),
                updatedAt: new Date(booking.updatedAt),
            }));
            console.log('Retrieved bookings from localStorage:', bookings.length);
            return bookings;
        }
        console.log('No bookings found in localStorage');
        return [];
    } catch (error) {
        console.error("Lỗi đọc localStorage:", error);
        return [];
    }
};

const saveBookingsToStorage = (bookings: Booking[]) => {
    localStorage.setItem(BOOKINGS_STORAGE_KEY, JSON.stringify(bookings));
    console.log('Saved bookings to localStorage:', bookings.length);
};

let mockBookings: Booking[] = getBookingsFromStorage();


if (mockBookings.length === 0) {
    const tenantUser = mockUsers.find(u => u.role.name === 'renter');
    if (tenantUser && allMotels.length > 0) {
        mockBookings = [
            {
                id: uuidv4(),
                motelId: allMotels[0].id,
                tenantId: tenantUser.id,
                ownerId: allMotels[0].owner.id,
                startDate: new Date('2025-10-10').toISOString(),
                endDate: new Date('2025-11-10').toISOString(),
                numberOfGuests: 1,
                depositAmount: Math.round(allMotels[0].price.value * 0.5),
                guestInfo: { fullName: tenantUser.fullName, phoneNumber: tenantUser.phoneNumber!, email: tenantUser.email },
                status: 'PENDING_APPROVAL',
                createdAt: new Date('2025-10-01T10:00:00Z').toISOString(),
                updatedAt: new Date('2025-10-01T10:00:00Z').toISOString(),
            },
        ];
        saveBookingsToStorage(mockBookings);
    }
}


const mockTransactions: Transaction[] = [
    {
        id: 'txn-confirmed-uuid',
        bookingId: 'booking-confirmed-uuid',
        totalAmountReceived: 3000000,
        commissionFeeEarned: 300000,
        payoutDueToLandlord: 2700000,
        payoutStatus: 'PAID_OUT'
    }
];


const populateTransaction = (transaction: Transaction): PopulatedTransaction => {
    const relatedBooking = mockBookings.find(b => b.id === transaction.bookingId);
    if (!relatedBooking) {
        throw new Error(`Không tìm thấy booking cho transaction ID: ${transaction.id}`);
    }
    const populatedBookingInfo = populateBooking(relatedBooking);

    return {
        ...transaction,
        bookingInfo: populatedBookingInfo,
    };
};

const populateBooking = (booking: Booking): PopulatedBooking | null => {
    const motel = allMotels.find(m => m.id === booking.motelId);
    const tenant = mockUsers.find(u => u.id === booking.tenantId);
    const owner = mockUsers.find(u => u.id === booking.ownerId);

    if (!motel || !tenant || !owner) {
        console.warn(`Dữ liệu không đồng bộ, bỏ qua booking ID: ${booking.id}`);
        return null;
    }
    const { motelId: _m, tenantId: _t, ownerId: _o, ...restOfBooking } = booking;
    const { password: _p1, ...safeTenant } = tenant;
    const { password: _p2, ...safeOwner } = owner;

    return { ...restOfBooking, motel, tenant: safeTenant, owner: safeOwner };
};

export const fetchBookingByUserAndMotel = async (userId: string, motelId: string): Promise<PopulatedBooking | null> => {
    const activeStatuses: Booking['status'][] = ['PENDING_APPROVAL', 'APPROVED_PENDING_DEPOSIT', 'CONFIRMED'];

    const booking = mockBookings.find(b =>
        b.tenantId === userId &&
        b.motelId === motelId &&
        activeStatuses.includes(b.status)
    );

    if (booking) {
        return populateBooking(booking);
    }
    return null;
};



export const fetchPendingPayouts = async (): Promise<PopulatedTransaction[]> => {
    await new Promise(r => setTimeout(r, 500));
    const pending = mockTransactions.filter(t => t.payoutStatus === 'PENDING_PAYOUT');
    return pending.map(populateTransaction); // Trả về dữ liệu đã được làm giàu
};


export const confirmDepositAndCreateTransaction = async (data: { bookingId: string; amount: number }): Promise<{
    booking: Booking;
    transaction: Transaction
}> => {
    const booking = await updateBookingStatus(data.bookingId, 'CONFIRMED');
    await updateMotel({id: booking.motelId, status: 'rented'});

    const commissionRate = 0.10;
    const commissionFee = data.amount * commissionRate;
    const payoutDue = data.amount - commissionFee;

    const newTransaction: Transaction = {
        id: uuidv4(),
        bookingId: data.bookingId,
        totalAmountReceived: data.amount,
        commissionFeeEarned: commissionFee,
        payoutDueToLandlord: payoutDue,
        payoutStatus: 'PENDING_PAYOUT',
    };
    mockTransactions.push(newTransaction);

    return {booking, transaction: newTransaction};
};
export const approveBooking = async (bookingId: string): Promise<Booking> => {
    return await updateBookingStatus(bookingId, 'APPROVED_PENDING_DEPOSIT');
};
export const rejectBooking = async (bookingId: string): Promise<Booking> => {
    const booking = await updateBookingStatus(bookingId, 'REJECTED');
    const motelToUpdate = allMotels.find(m => m.id === booking.motelId);
    if (motelToUpdate) {
        await updateMotel({ id: motelToUpdate.id, status: 'published' });
    }

    return booking;
};
export const cancelBooking = async (bookingId: string): Promise<Booking> => {
    const booking = await updateBookingStatus(bookingId, 'CANCELLED');
    const motelToUpdate = allMotels.find(m => m.id === booking.motelId);
    if (motelToUpdate) {
        await updateMotel({ id: motelToUpdate.id, status: 'published' });
    }

    return booking;
};
export const markPayoutAsPaid = async (transactionId: string): Promise<Transaction> => {
    await new Promise(r => setTimeout(r, 700));
    const transaction = mockTransactions.find(t => t.id === transactionId);
    if (!transaction) throw new Error("Không tìm thấy giao dịch");

    transaction.payoutStatus = 'PAID_OUT';
    console.log(`Transaction ${transactionId} marked as PAID_OUT.`);
    return transaction;
};

// BOOKING
export const createBooking = async (data: Omit<Booking, 'id' | 'status' | 'createdAt' | 'updatedAt'>): Promise<Booking> => {
    const now = new Date().toISOString();
    const newBooking: Booking = { ...data, id: uuidv4(), status: 'PENDING_APPROVAL', createdAt: now, updatedAt: now };
    mockBookings.unshift(newBooking);
    saveBookingsToStorage(mockBookings);
    console.log('Created booking:', newBooking);
    console.log('Total bookings in storage:', mockBookings.length);
    return newBooking;
};

const updateBookingStatus = async (bookingId: string, newStatus: Booking['status']): Promise<Booking> => {

    await new Promise(r => setTimeout(r, 700));
    const booking = mockBookings.find(b => b.id === bookingId);
    if (!booking) {
        throw new Error(`Không tìm thấy đơn đặt phòng với ID: ${bookingId}`);
    }
    booking.status = newStatus;
    saveBookingsToStorage(mockBookings);
    return booking;
};

const fetchAndPopulate = (filterFn: (b: Booking) => boolean): PopulatedBooking[] => {
    return getBookingsFromStorage()
        .filter(filterFn)
        .map(populateBooking)
        .filter((b): b is PopulatedBooking => b !== null);
};

export const fetchMyBookings = async (userId: string): Promise<PopulatedBooking[]> => {
    return fetchAndPopulate(b => b.tenantId === userId);
};

export const fetchLandlordRequests = async (landlordId: string): Promise<PopulatedBooking[]> => {
    return fetchAndPopulate(b => b.ownerId === landlordId && b.status === 'PENDING_APPROVAL');
};

export const fetchAllPendingBookings = async (): Promise<PopulatedBooking[]> => {
    const bookings = fetchAndPopulate(b => b.status === 'PENDING_APPROVAL');
    console.log('Fetched pending bookings:', bookings.length);
    return bookings;
};

// LOCAL STORAGE


