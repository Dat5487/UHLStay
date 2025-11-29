import type {AdminDashboardData, Role, TrendDataPoint, User} from "../../types";
import {mockUsers} from "../../services/authApi.ts";
import {allRoles} from "../../services/rbacApi.ts";
import {v4 as uuidv4} from "uuid";

// interface UserFilters {
//     keyword?: string;
//     role?: UserRole;
// }

const generateMiniTrend = (): TrendDataPoint[] =>
    Array.from({ length: 10 }, (_, i) => ({
        day: `${i + 1}`,
        value: Math.floor(50 + Math.random() * 150),
    }));

export const fetchAdminDashboardData = async (): Promise<AdminDashboardData> => {
    console.log("API: Fetching UniStay Admin dashboard data...");
    await new Promise(r => setTimeout(r, 600));

    return {
        totalListings: {
            title: 'Tổng số tin đăng',
            total: 1350,
            dayValue: 28,
            trend: generateMiniTrend(),
        },
        listingViews: {
            title: 'Tổng lượt xem tin',
            total: 98650,
            dayValue: 1234,
            trend: generateMiniTrend(),
        },
        occupancyRate: {
            title: 'Tỷ lệ lấp đầy',
            total: '85%',
            dayValue: 2, // Tăng 2%
            trend: generateMiniTrend(),
        },
        newUsers: {
            title: 'Người dùng mới',
            total: 73,
            dayValue: 5,
            trend: generateMiniTrend(),
        },

        // --- Dữ liệu cho biểu đồ cột "Tin đăng mới theo tháng" ---
        newListingsTrend: [
            { month: 'Thg 1', motels: 20, items: 45 }, { month: 'Thg 2', motels: 15, items: 30 },
            { month: 'Thg 3', motels: 30, items: 55 }, { month: 'Thg 4', motels: 25, items: 60 },
            { month: 'Thg 5', motels: 40, items: 70 }, { month: 'Thg 6', motels: 35, items: 80 },
            { month: 'Thg 7', motels: 50, items: 90 }, { month: 'Thg 8', motels: 45, items: 85 },
        ],

        // --- Dữ liệu cho bảng xếp hạng "Tin được xem nhiều nhất" ---
        topViewedListings: [
            { rank: 1, title: 'Phòng trọ khép kín Đống Đa', views: 5234 },
            { rank: 2, title: 'Pass lại tủ lạnh Mini Aqua', views: 4899 },
            { rank: 3, title: 'Chung cư mini Cầu Giấy full đồ', views: 4567 },
            { rank: 4, title: 'Tìm người ở ghép khu vực Mỹ Đình', views: 3987 },
            { rank: 5, title: 'Thanh lý giáo trình Kinh tế Vi mô', views: 3501 },
        ],
    };
};
export const fetchAllUsers = async (): Promise<User[]> => {
    await new Promise(r => setTimeout(r, 500));
    return mockUsers.map(({ password: _ , ...user }) => user);
};

export const createUser = async (data: Omit<User, 'id'> & { password: string }): Promise<User> => {
    await new Promise(r => setTimeout(r, 500));
    if (mockUsers.some(u => u.email === data.email)) {
        throw new Error('Email đã tồn tại');
    }
    // Map role string to Role object if needed
    const roleName = (data as any).role && typeof (data as any).role === 'string' ? (data as any).role : (data as any).role?.name;
    const resolvedRole: Role | undefined = roleName ? allRoles.find(r => r.name === roleName) : undefined;
    const newUserInternal: (User & { password: string }) = {
        ...(data as any),
        role: (resolvedRole ?? (data as any).role) as User['role'],
        permissions: resolvedRole ? resolvedRole.permissions : (data as any).permissions,
        id: uuidv4(),
    };
    mockUsers.push(newUserInternal);
    const { password: _ , ...userToReturn } = newUserInternal;
    return userToReturn;
};

export const updateUser = async (data: Partial<User> & { id: string }): Promise<User> => {
    await new Promise(r => setTimeout(r, 500));
    const index = mockUsers.findIndex(u => u.id === data.id);
    if (index === -1) throw new Error('Không tìm thấy người dùng');
    let updated = { ...mockUsers[index], ...data } as any;
    if (data.role) {
        const roleName = typeof data.role === 'string' ? data.role : data.role.name;
        const resolvedRole = allRoles.find(r => r.name === roleName);
        if (resolvedRole) {
            updated.role = resolvedRole;
            updated.permissions = resolvedRole.permissions;
        }
    }
    mockUsers[index] = updated;
    const { password: _ , ...userToReturn } = mockUsers[index];
    return userToReturn;
};

export const deleteUser = async (userId: string): Promise<{ id: string }> => {
    await new Promise(r => setTimeout(r, 500));
    const remaining = mockUsers.filter(u => u.id !== userId);
    // mutate the original array to preserve reference
    mockUsers.length = 0;
    mockUsers.push(...remaining);
    return { id: userId };
};



