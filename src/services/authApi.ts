import type {LoginCredentials, RegisterFormData, Role, User} from "../types";
import {v4 as uuidv4} from "uuid";
import {allRoles} from "./rbacApi.ts";


let mockUsers: (User & { password: string })[] = [
    {
        id: uuidv4(),
        email: 'renter@gmail.com',
        password: '123456',
        fullName: 'Bạn Người Thuê',
        gender: 'male',
        age: 1000,
        phoneNumber: '0987654321',
        address: 'Quảng Ninh',
        role: allRoles.find(r => r.name === 'renter')!,
        permissions: allRoles.find(r => r.name === 'renter')!.permissions,
        avatar: 'https://i.pravatar.cc/150?u=renter@gmail.com'
    },
    {
        id: uuidv4(),
        email: 'landlord@gmail.com',
        password: '123456',
        fullName: 'Bạn Chủ Nhà',
        gender: 'male',
        address: 'Quảng Ninh',
        role: allRoles.find(r => r.name === 'landlord')!,
        permissions: allRoles.find(r => r.name === 'landlord')!.permissions,
        avatar: 'https://i.pravatar.cc/150?u=landlord@gmail.com'
    },
    {
        id: uuidv4(),
        email: 'admin@gmail.com',
        password: '123456',
        fullName: 'Administrator',
        gender: 'male',
        age: 1000,
        phoneNumber: '0987654321',
        address: 'Quảng Ninh',
        role: allRoles.find(r => r.name === 'admin')!,
        permissions: allRoles.find(r => r.name === 'admin')!.permissions,
        avatar: 'https://i.pravatar.cc/150?u=admin@gmail.com'
    }
];

export const apiRegister = async (data: RegisterFormData & { role?: Role['name'] }): Promise<User> => {
    console.log('API: Đang xử lý đăng ký với:', data);
    await new Promise(r => setTimeout(r, 1000));

    if (mockUsers.some(user => user.email === data.email)) {
        throw new Error('Email này đã được sử dụng.');
    }
    const resolvedRole = data.role ? allRoles.find(r => r.name === data.role) : allRoles.find(r => r.name === 'renter');
    const newUser: User & { password: string } = {
        id: uuidv4(),
        email: data.email,
        gender: data.gender,
        age: data.age,
        password: data.password,
        fullName: data.fullName,
        phoneNumber: data.phoneNumber,
        role: resolvedRole!,
        permissions: resolvedRole!.permissions,
        avatar: `https://i.pravatar.cc/150?u=${data.email}`
    };

    mockUsers.push(newUser);

    const {password: _, ...userToReturn } = newUser;
    return userToReturn;
};

export const fetchAllUsers = async (): Promise<User[]> => {
    await new Promise(r => setTimeout(r, 500));
    return mockUsers.map(({ password: _, ...user }) => user);
};

export const fetchUserById = async (userId: string): Promise<User | undefined> => {
    console.log(`API: Fetching user profile for ID: ${userId}`);
    await new Promise(r => setTimeout(r, 500));
    const userInDb = mockUsers.find(u => u.id === userId);

    if (userInDb) {
        const { password: _, ...userToReturn } = userInDb;
        return userToReturn;
    }

    return undefined;
};

export const apiGetCurrentUser = async (): Promise<User | null> => {
    await new Promise(r => setTimeout(r, 300));
    const currentUserId = localStorage.getItem('currentUserId');
    if (!currentUserId) return null;

    const userInDb = mockUsers.find(u => u.id === currentUserId);
    if (userInDb) {
        const { password: _, ...userToReturn } = userInDb;
        return userToReturn;
    }
    return null;
};

export const updateUserProfile = async (updatedData: Partial<User> & { id: string }): Promise<User> => {
    console.log("API: Updating user profile with...", updatedData);
    await new Promise(r => setTimeout(r, 800));

    const userIndex = mockUsers.findIndex(u => u.id === updatedData.id);
    if (userIndex === -1) {
        throw new Error("Không tìm thấy người dùng để cập nhật.");
    }
    mockUsers[userIndex] = { ...mockUsers[userIndex], ...updatedData };

    const { password: _, ...userToReturn } = mockUsers[userIndex];
    return userToReturn;
};

export const deleteUser = async (userId: string): Promise<{ id: string }> => {
    await new Promise(r => setTimeout(r, 500));
    mockUsers = mockUsers.filter(u => u.id !== userId);
    return { id: userId };
};

export {mockUsers}

export const mockLandlords: User[] = mockUsers
    .filter(user => user.role.name === 'landlord')
    .map(({ password, ...user }) => user);

export const apiLogin = async (credentials: LoginCredentials): Promise<User> => {
    await new Promise(r => setTimeout(r, 500));
    const userInDb = mockUsers.find(
        user => user.email === credentials.email && user.password === credentials.password
    );

    if (userInDb) {
        // Lưu "session" vào localStorage
        localStorage.setItem('currentUserId', userInDb.id);
        const { password: _, ...userToReturn } = userInDb;
        return userToReturn;
    } else {
        throw new Error('Email hoặc mật khẩu không chính xác.');
    }
};

export const apiLogout = async (): Promise<{ success: boolean }> => {
    await new Promise(r => setTimeout(r, 300));
    localStorage.removeItem('currentUserId');
    console.log('API: User logged out.');
    return { success: true };
};