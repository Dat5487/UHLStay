// src/components/message/ChatWindow.tsx
import React from 'react';
import {useQuery, useMutation, useQueryClient} from '@tanstack/react-query';
import {List, Skeleton, Typography, Form, Avatar, message} from 'antd';
import type {Message, SimplifiedUser} from '../../types';
import {useAuth} from '../../hooks/useAuth.ts';
import MessageBubble from './MessageBubble.tsx';
import MessageInput from './MessageInput.tsx';
import {fetchMessagesByConversationId, sendMessage} from "../../services/messengerApi.ts";

const {Text} = Typography;

interface ChatWindowProps {
    conversationId: string;
    otherUser: SimplifiedUser;
}

const ChatWindow: React.FC<ChatWindowProps> = ({conversationId, otherUser}) => {
    const {user: currentUser} = useAuth();
    const [form] = Form.useForm();
    const queryClient = useQueryClient();
    const queryKey = ['messages', conversationId];

    const {data: messages, isLoading} = useQuery({
        queryKey: ['messages', conversationId],
        queryFn: () => fetchMessagesByConversationId(conversationId),
        enabled: !!conversationId,
    });

    const { mutate: send, isPending } = useMutation({
        mutationFn: (text: string) => sendMessage({ conversationId, text, sender: currentUser! }),
        onMutate: async (newText: string) => {
            await queryClient.cancelQueries({ queryKey });
            const previousMessages = queryClient.getQueryData<Message[]>(queryKey);

            const optimisticMessage: Message = {
                id: Date.now(),
                text: newText,
                senderId: currentUser!.id,
                createdAt: new Date(),
            };
            queryClient.setQueryData<Message[]>(queryKey, (old = []) => [...old, optimisticMessage]);

            return { previousMessages };
        },
        onError: (_err, _newText, context) => {
            message.error("Gửi tin nhắn thất bại!");
            if (context?.previousMessages) {
                queryClient.setQueryData(queryKey, context.previousMessages);
            }
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey });
        },
    });

    const handleSendMessage = (text: string) => {
        if (text.trim()) {
            send(text.trim());
        }
    };

    if (isLoading) return <div className="p-4"><Skeleton active avatar /></div>;

    return (
        <div className="h-full flex flex-col bg-white">
            <div className="p-3 border-b flex items-center">
                <Avatar src={otherUser.avatar} className="mr-3">{otherUser.fullName.charAt(0)}</Avatar>
                <Text strong>{otherUser.fullName}</Text>
            </div>
            <div className="flex-1 overflow-y-auto p-4">
                <List
                    dataSource={messages}
                    renderItem={(item: Message) => (
                        <MessageBubble message={item} otherUser={otherUser}/>
                    )}
                />
            </div>
            <MessageInput
                form={form}
                onSendMessage={handleSendMessage}
                isLoading={isPending}
            />
        </div>
    );
};

export default ChatWindow;