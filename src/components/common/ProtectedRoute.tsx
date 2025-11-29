import {Navigate, Outlet, useLocation} from "react-router-dom";
import {useAppSelector} from "../../store/hooks.ts";
import {selectCurrentUser, selectIsAuthenticated, selectIsInitialized} from "../../store/slices/authSlice.ts";
import type {UserRole} from "../../types";
import type {ReactNode} from "react";
import {Spin} from "antd";

interface ProtectedRouteProps {
    children?: ReactNode;
    allowedRoles?: UserRole[];
}
const ProtectedRoute = ({ allowedRoles }: ProtectedRouteProps) => {
    const isAuthenticated = useAppSelector(selectIsAuthenticated);
    const user = useAppSelector(selectCurrentUser);
    const isInitialized = useAppSelector(selectIsInitialized);
    const location = useLocation();

    // Show loading spinner while initializing auth
    if (!isInitialized) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <Spin size="large" />
            </div>
        );
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    if (allowedRoles && user && !allowedRoles.includes(user.role.name)) {
        return <Navigate to="/unauthorized" replace />;
    }

    return <Outlet />
};
export default ProtectedRoute;