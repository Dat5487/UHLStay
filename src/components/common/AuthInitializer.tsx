import { useEffect } from 'react';
import { useAppDispatch } from '../../store/hooks';
import { initializeAuth } from '../../store/slices/authSlice';

export const AuthInitializer = () => {
    const dispatch = useAppDispatch();

    useEffect(() => {
        console.log('AuthInitializer: Starting auth initialization');
        dispatch(initializeAuth());
    }, [dispatch]);

    return null;
};
