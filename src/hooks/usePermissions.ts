import { useAppSelector } from '../store/hooks';
import { selectUserPermissions } from '../store/slices/authSlice';
import type { PermissionName } from '../types';

export const usePermissions = () => {
    const permissions = useAppSelector(selectUserPermissions);
    const hasPermission = (requiredPermission: PermissionName): boolean => {
        if (permissions.includes(`admin:*`)) {
            return true;
        }
        return permissions.includes(requiredPermission);
    };

    return { hasPermission };
};