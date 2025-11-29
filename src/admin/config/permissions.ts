
export const PERMISSIONS = {
    DASHBOARD: {
        VIEW: 'dashboard:view',
    },
    MOTEL: {
        READ: 'motel:read',
        READ_ALL: 'motel:read_all',
        CREATE: 'motel:create',
        DELETE: 'motel:delete',
        UPDATE: 'motel:update',
    },
    ITEM: {
        READ: 'item:read',
        READ_ALL: 'item:read_all',
        CREATE: 'item:create',
        DELETE: 'item:delete',
        UPDATE: 'item:update',
    },
    USER: {
        READ: 'user:read',
        READ_ALL: 'user:read_all',
        CREATE: 'user:create',
        UPDATE: 'user:update',
        DELETE: 'user:delete',
    },
    ROLE: {
        READ: 'role:read',
        READ_ALL: 'role:read_all',
        CREATE: 'role:create',
        UPDATE: 'role:update',
        DELETE: 'role:delete',
    },
    PERMISSION: {
        READ: 'permission:read',
        READ_ALL: 'permission:read_all'
    },
    COMMENT: {
        CREATE: 'comment:create',
        READ: 'comment:read',
        UPDATE: 'comment:update',
        DELETE: 'comment:delete',
    },
    POST: { // Blog
        CREATE: 'post:create',
        READ: 'post:read',
        READ_ALL: 'post:read_all',
        UPDATE: 'post:update',
        DELETE: 'post:delete',
    },
    MANAGE: {
        MOTEL: 'manage:motel',
        ITEM: 'manage:item',
        USER: 'manage:user',
        ROLE: 'manage:role',
        PERMISSION: 'manage:permission',
        COMMENT: 'manage:comment',
        POST: 'manage:post',
        RENT_CONTROL: 'manage:rent_controls',
        BOOKING: 'manage:booking',
    },
    BOOKING: {
        CREATE: 'booking:create',
        READ: 'booking:read',
        READ_ALL: 'booking:read_all',
        UPDATE: 'booking:update',
        DELETE: 'booking:delete',
    }
} as const;
export const ALL_PERMISSION_NAMES = Object.values(PERMISSIONS).flatMap(resource => Object.values(resource));