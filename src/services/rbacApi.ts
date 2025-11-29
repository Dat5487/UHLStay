import type {Permission, Role} from "../types";
import {PERMISSIONS} from "../admin/config/permissions.ts";

let allPermissions: Permission[] = [
    { id: 1, name: PERMISSIONS.DASHBOARD.VIEW, description: 'Xem trang dashboard tổng quan' },
    { id: 2, name: PERMISSIONS.USER.READ, description: 'Xem người dùng'},
    { id: 3, name: PERMISSIONS.USER.CREATE, description: 'Tạo người dùng'},
    { id: 4, name: PERMISSIONS.USER.READ_ALL, description: "Xem danh sách người dùng"},
    { id: 5, name: PERMISSIONS.USER.UPDATE, description: "Cập nhật người dùng"},
    { id: 6, name: PERMISSIONS.USER.DELETE, description: "Xóa người dùng"},
    { id: 7, name: PERMISSIONS.ROLE.READ, description: "Xem vai trò"},
    { id: 8, name: PERMISSIONS.ROLE.CREATE, description: "Tạo vai trò"},
    { id: 9, name: PERMISSIONS.ROLE.READ_ALL, description: "Xem danh sách vai trò"},
    { id: 10, name: PERMISSIONS.ROLE.UPDATE, description: "Cập nhật người dùng"},
    { id: 11, name: PERMISSIONS.ROLE.DELETE, description: "Xóa vai trò"},
    { id: 12, name: PERMISSIONS.PERMISSION.READ, description: "Xem quyền"},
    { id: 13, name: PERMISSIONS.MOTEL.READ, description: "Xem tin đăng phòng trọ"},
    { id: 14, name: PERMISSIONS.MOTEL.CREATE, description: "Tạo tin đăng phòng trọ"},
    { id: 15, name: PERMISSIONS.MOTEL.READ_ALL, description: "Xem danh sách tin đăng phòng trọ"},
    { id: 16, name: PERMISSIONS.MOTEL.UPDATE, description: "Cập nhật tin đăng phòng trọ"},
    { id: 17, name: PERMISSIONS.MOTEL.DELETE, description: "Xóa tin đăng phòng trọ"},
    { id: 18, name: PERMISSIONS.ITEM.READ, description: "Xem đồ cũ"},
    { id: 19, name: PERMISSIONS.ITEM.CREATE, description: "Tạo đồ cũ"},
    { id: 20, name: PERMISSIONS.ITEM.READ_ALL, description: "Xem danh sách đồ cũ"},
    { id: 21, name: PERMISSIONS.ITEM.UPDATE, description: "Cập nhật đồ cũ"},
    { id: 22, name: PERMISSIONS.ITEM.DELETE, description: "Xóa đồ cũ"},
    { id: 23, name: PERMISSIONS.POST.READ, description: "Xem bài viết"},
    { id: 24, name: PERMISSIONS.POST.CREATE, description: "Tạo bài viết"},
    { id: 25, name: PERMISSIONS.POST.READ_ALL, description: "Xem danh sách bài viết"},
    { id: 26, name: PERMISSIONS.POST.UPDATE, description: "Cập nhật bài viết"},
    { id: 27, name: PERMISSIONS.POST.DELETE, description: "Xóa bài viết"},
    { id: 28, name: PERMISSIONS.COMMENT.READ, description: "Xem bình luận"},
    { id: 29, name: PERMISSIONS.COMMENT.CREATE, description: "Tạo bình luận"},
    { id: 30, name: PERMISSIONS.MANAGE.USER, description: "Quản lý người dùng"},
    { id: 31, name: PERMISSIONS.MANAGE.MOTEL, description: "Quản lý tin đăng phòng trọ"},
    { id: 32, name: PERMISSIONS.MANAGE.ITEM, description: "Quản lý đồ cũ"},
    { id: 33, name: PERMISSIONS.MANAGE.POST, description: "Quản lý bài viết"},
    { id: 34, name: PERMISSIONS.MANAGE.COMMENT, description: "Quản lý bình luận"},
    { id: 35, name: PERMISSIONS.MANAGE.ROLE, description: "Quản lý vai trò"},
    { id: 36, name: PERMISSIONS.MANAGE.PERMISSION, description: "Quản lý quyền"},
    { id: 37, name: PERMISSIONS.MANAGE.RENT_CONTROL, description: "Quản lý đăng tin phòng"},
    { id: 38, name: PERMISSIONS.MANAGE.BOOKING, description: "Quản lý đặt phòng"},
    { id: 39, name: PERMISSIONS.BOOKING.CREATE, description: "Đặt phòng"},
];


let allRoles: Role[] = [
    {
        id: 1,
        name: 'renter',
        permissions: [...allPermissions.map(p => p.name)]
    },
    {
        id: 2,
        name: 'landlord',
        permissions: [
            PERMISSIONS.DASHBOARD.VIEW,
            PERMISSIONS.MOTEL.READ, PERMISSIONS.MOTEL.CREATE, PERMISSIONS.MOTEL.UPDATE, PERMISSIONS.MOTEL.DELETE,
            PERMISSIONS.ITEM.READ, PERMISSIONS.ITEM.CREATE, PERMISSIONS.ITEM.UPDATE, PERMISSIONS.ITEM.DELETE,
            PERMISSIONS.POST.READ, PERMISSIONS.POST.CREATE, PERMISSIONS.POST.UPDATE, PERMISSIONS.POST.DELETE,
            PERMISSIONS.COMMENT.READ, PERMISSIONS.COMMENT.CREATE,
            PERMISSIONS.MANAGE.MOTEL, PERMISSIONS.MANAGE.ITEM, PERMISSIONS.MANAGE.RENT_CONTROL, PERMISSIONS.MANAGE.BOOKING,
            PERMISSIONS.BOOKING.CREATE,
        ]
    },
    {
        id: 3,
        name: 'admin',
        permissions: [...allPermissions.map(p => p.name)]
    },
];
export const fetchAllPermissions = async (): Promise<Permission[]> => {
    await new Promise(r => setTimeout(r, 500));
    return allPermissions;
};

export const fetchAllRoles = async (): Promise<Role[]> => {
    await new Promise(r => setTimeout(r, 500));
    return allRoles;
};

export const fetchPermissionById = async (permissionId: number): Promise<Permission | undefined> => {
    await new Promise(r => setTimeout(r, 500));
    return allPermissions.find(p => p.id === permissionId);
};

export const fetchRoleById = async (roleId: number): Promise<Role | undefined> => {
    await new Promise(r => setTimeout(r, 500));
    return allRoles.find(r => r.id === roleId);
}

export const createPermission = async (data: Permission): Promise<Permission> => {
    await new Promise(r => setTimeout(r, 500));
    const newPermission = {...data, id: Date.now()};
    allPermissions.push(newPermission);
    return data;
};

export const createRole = async (data: Omit<Role, 'id'>): Promise<Role> => {
    await new Promise(r => setTimeout(r, 500));
    const newRole = {...data, id: Date.now()};
    allRoles.push(newRole);
    return newRole;
};
export const updateRole = async (data: Partial<Role> & { id: number }): Promise<Role> => {
    await new Promise(r => setTimeout(r, 500));
    const index = allRoles.findIndex(role => role.id === data.id);
    if (index === -1) throw new Error("Không tìm thấy vai trò");
    allRoles[index] = {...allRoles[index], ...data};
    return allRoles[index];
};

export const updatePermission = async (data: Partial<Permission> & { id: number }): Promise<Permission> => {
    await new Promise(r => setTimeout(r, 500));
    const index = allPermissions.findIndex(permission => permission.id === data.id);
    if (index === -1) throw new Error("Không tìm thấy quyền");
    allPermissions[index] = {...allPermissions[index], ...data};
    return allPermissions[index];
};

export const deleteRole = async (roleId: number): Promise<{ id: number }> => {
    await new Promise(r => setTimeout(r, 500));
    const roleToDelete = allRoles.find(r => r.id === roleId);
    if (['admin', 'landlord', 'renter'].includes(roleToDelete?.name || '')) {
        throw new Error("Không thể xóa các vai trò hệ thống.");
    }
    allRoles = allRoles.filter(r => r.id !== roleId);
    return {id: roleId};
};
export const deletePermission = async (permissionId: number): Promise<{ id: number }> => {
    await new Promise(r => setTimeout(r, 500));
    allPermissions = allPermissions.filter(permission => permission.id !== permissionId);
    return {id: permissionId};
};

export {allPermissions, allRoles}

