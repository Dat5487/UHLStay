import {useEffect, useState} from "react";
import {
    Alert,
    Divider,
    Form,
    message,
    Result,
    Spin,
} from "antd";
import {useAppDispatch, useAppSelector} from "../../store/hooks.ts";
import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {fetchUserById, updateUserProfile} from "../../services/authApi.ts";
import {selectCurrentUser, updateUserInfo} from "../../store/slices/authSlice.ts";
import type {User} from "../../types";
import {Navigate} from "react-router-dom";
import ProfileHeader from "../../components/auth/profile/ProfileHeader.tsx";
import ProfileDisplay from "../../components/auth/profile/ProfileDisplay.tsx";
import ProfileEditForm from "../../components/auth/profile/ProfileEditForm.tsx";


const ProfilePage = () => {
    const [isEditing, setIsEditing] = useState(false);
    const [form] = Form.useForm();
    const dispatch = useAppDispatch();
    const queryClient = useQueryClient();

    const currentUserInStore = useAppSelector(selectCurrentUser);
    const userId = currentUserInStore?.id;

    const { data: user, isLoading, error, isSuccess } = useQuery({
        queryKey: ['userProfile', userId],

        queryFn: () => fetchUserById(userId!),

        enabled: !!userId,
    });

    const { mutate: updateProfile, isPending: isUpdating } = useMutation({
        mutationFn: updateUserProfile,
        onSuccess: (updatedUser) => {
            message.success('Cập nhật thông tin thành công!');
            queryClient.setQueryData(['userProfile', userId], updatedUser);
            dispatch(updateUserInfo(updatedUser));
            setIsEditing(false);
        },
        onError: (err) => message.error(err.message),
    });

    useEffect(() => {
        if (isEditing && user) {
            form.setFieldsValue(user);
        }
    }, [isEditing, user, form]);

    const onFinish = (values: Partial<User>) => {
        if (!user) return;
        console.log('Updating with:', values);
        updateProfile({ ...values, id: user.id });
    };

    if (isLoading) {
        return <div className="flex justify-center items-center h-96"><Spin size="large" /></div>;
    }

    if (error || !user) {
        return <Alert message="Lỗi" description="Không thể tải thông tin người dùng." type="error" showIcon />;
    }

    if (isSuccess && !user) {
        return <Result status="warning" title="Không thể tải dữ liệu của bạn." />;
    }

    if (!currentUserInStore) {
        return <Navigate to="/login" replace />;
    }

    return (
        <div className="max-w-3xl mx-auto bg-white p-8 rounded-lg shadow-md">
            <ProfileHeader
                user={user}
                isEditing={isEditing}
                onEditToggle={() => setIsEditing(!isEditing)}
            />
            <Divider />
            {isEditing ? (
                <ProfileEditForm
                    form={form}
                    onFinish={onFinish}
                    onCancel={() => setIsEditing(false)}
                    isLoading={isUpdating}
                />
            ) : (
                <ProfileDisplay user={user} />
            )}
        </div>
    );
}

export default ProfilePage