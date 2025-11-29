// src/hooks/useRealtimeChatUpdater.ts
import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import type { ConversationSummary, Message } from '../types';
import {chatEvents} from "../services/messengerApi.ts";
import {useAuth} from "./useAuth.ts";

export const useRealtimeChatUpdater = (activeConvId: string | null) => {
    const queryClient = useQueryClient();
    const { user } = useAuth();

    useEffect(() => {
        const handleNewMessage = ({ conversationId, message }: { conversationId: string, message: Message }) => {
            if (message.senderId === user?.id) return;

            queryClient.setQueryData<Message[]>(['messages', conversationId], (oldMessages = []) => {
                if (oldMessages.some(m => m.id === message.id)) return oldMessages;
                return [...oldMessages, message];
            });

            queryClient.setQueryData<ConversationSummary[]>(['conversations'], (oldSummaries = []) => {
                const updatedSummaries = oldSummaries.map(summary => {
                    if (summary.id === conversationId) {
                        const newUnreadCount = conversationId !== activeConvId ? summary.unreadCount + 1 : 0;
                        return { ...summary, lastMessage: message, unreadCount: newUnreadCount };
                    }
                    return summary;
                });
                return updatedSummaries.sort((a, b) => new Date(b.lastMessage.createdAt).getTime() - new Date(a.lastMessage.createdAt).getTime());
            });
        };

        chatEvents.on('newMessage', handleNewMessage);
        return () => chatEvents.off('newMessage', handleNewMessage);
    }, [queryClient, activeConvId, user]);
};