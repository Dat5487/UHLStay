import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';

const COMMENTS_STORAGE_KEY = import.meta.env.VITE_COMMENTS_STORAGE_KEY || 'unistay_mock_comments_default';

export const useRealtimeComments = (resourceId: string | number) => {
    const queryClient = useQueryClient();

    useEffect(() => {
        const handleStorageChange = (event: StorageEvent) => {
            if (event.key === COMMENTS_STORAGE_KEY) {
                console.log('Phát hiện thay đổi trong comments, đang làm mới...');
                queryClient.invalidateQueries({ queryKey: ['comments', resourceId] });
            }
        };
        window.addEventListener('storage', handleStorageChange);
        return () => {
            window.removeEventListener('storage', handleStorageChange);
        };
    }, [queryClient, resourceId]);
};