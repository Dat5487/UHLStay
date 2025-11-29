// src/components/message/MessageBubble.tsx
import { Avatar, Tooltip } from "antd";
import type { Message, SimplifiedUser } from "../../types";
import { useAuth } from "../../hooks/useAuth.ts";

interface MessageBubbleProps {
    message: Message;
    otherUser: SimplifiedUser;
}

const MessageBubble = ({ message, otherUser }: MessageBubbleProps) => {
    const { user: currentUser } = useAuth();
    const isMe = message.senderId === currentUser?.id;

    const alignmentClass = isMe ? 'justify-end' : 'justify-start';
    const bubbleColorClass = isMe ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800';
    const bubbleOrderClass = isMe ? 'flex-row-reverse' : 'flex-row'; // Đảo ngược thứ tự cho tin nhắn của "tôi"

    const sender = isMe ? currentUser : otherUser;

    return (
        <div className={`flex w-full ${alignmentClass}`}>
            <div className={`flex items-end gap-2 max-w-[75%] ${bubbleOrderClass}`}>
                <Tooltip title={sender?.fullName}>
                    <Avatar src={sender?.avatar} size="small" className={"!mb-4"}/>
                </Tooltip>
                <Tooltip title={new Date(message.createdAt).toLocaleString('vi-VN')}>
                    <div className={`!px-4 !py-2 !my-2 rounded-2xl ${bubbleColorClass}`}>
                        {message.text}
                    </div>
                </Tooltip>
            </div>
        </div>
    );
}
export default MessageBubble;