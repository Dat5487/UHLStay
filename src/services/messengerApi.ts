import type {ConversationSummary, Message, User} from "../types";
import {mockUsers} from "./authApi.ts";


function findUserByRole(roleName: 'renter' | 'landlord' | 'admin'): User {
    const user = mockUsers.find(u => u.role.name === roleName);
    if (!user) {
        throw new Error(`[Mock Data Error] User with role "${roleName}" not found.`);
    }
    return user;
}
const currentUser = findUserByRole('renter');
const landlordUser = findUserByRole('landlord');
const conversations: ConversationSummary[] = [
    {
        id: 'conv-1',
        otherUser: {
            id: landlordUser.id,
            fullName: landlordUser.fullName,
            avatar: landlordUser.avatar,
        },
        messages: [
            { id: 1, text: 'Chào bạn, phòng này vẫn còn trống nhé.', senderId: landlordUser.id, createdAt: new Date(Date.now() - 1000 * 60 * 5) },
            { id: 2, text: 'Dạ vâng, cuối tuần em qua xem được không ạ?', senderId: currentUser.id, createdAt: new Date(Date.now() - 1000 * 60 * 3) },
            { id: 3, text: 'Được bạn nhé, chiều bạn cứ qua.', senderId: landlordUser.id, createdAt: new Date(Date.now() - 1000 * 60) },
        ],
        get lastMessage() { return this.messages[this.messages.length - 1] },
        unreadCount: 1,
    },
    {
        id: 'conv-2',
        otherUser: {
            id: 'user-sv-an',
            fullName: 'Sinh Viên An',
            avatar: 'https://i.pravatar.cc/150?u=svan',
        },
        messages: [
            { id: 4, text: 'Ok bạn, mình lấy món này nhé.', senderId: 'user-sv-an', createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24) },
        ],
        get lastMessage() { return this.messages[this.messages.length - 1] },
        unreadCount: 0,
    }
];

interface ChatEventMap {
    'newMessage': (payload: { conversationId: string; message: Message }) => void;
}

export const chatEvents = {
    events: {} as { [K in keyof ChatEventMap]?: ChatEventMap[K][] },

    on<K extends keyof ChatEventMap>(eventName: K, fn: ChatEventMap[K]) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const eventList = (this.events[eventName] as any) || [];
        eventList.push(fn);
        this.events[eventName] = eventList;
    },

    off<K extends keyof ChatEventMap>(eventName: K, fn: ChatEventMap[K]) {
        const eventFns = this.events[eventName];
        if (eventFns) {
            this.events[eventName] = eventFns.filter(eventFn => fn !== eventFn);
        }
    },

    emit<K extends keyof ChatEventMap>(eventName: K, ...data: Parameters<ChatEventMap[K]>) {
        const eventFns = this.events[eventName];
        if (eventFns) {
            eventFns.forEach(fn => {

                // eslint-disable-next-line prefer-spread
                fn.apply(null, data as never);
            });
        }
    }
};

export const fetchConversations = async (): Promise<ConversationSummary[]> => {
    await new Promise(r => setTimeout(r, 500));
    return conversations.sort((a, b) => b.lastMessage.createdAt.getTime() - a.lastMessage.createdAt.getTime());
};

export const fetchMessagesByConversationId = async (conversationId: string): Promise<Message[]> => {
    await new Promise(r => setTimeout(r, 300));
    const conversation = conversations.find(c => c.id === conversationId);
    if (conversation) {
        conversation.unreadCount = 0; // Đánh dấu là đã đọc khi mở ra
    }
    return conversation ? conversation.messages : [];
};

export const sendMessage = async ({ conversationId, text, sender }: { conversationId: string; text: string; sender: User }): Promise<Message> => {
    await new Promise(r => setTimeout(r, 300));
    const conversation = conversations.find(c => c.id === conversationId);
    if (!conversation) throw new Error("Không tìm thấy cuộc hội thoại");

    const newMessage: Message = {
        id: Date.now(),
        text,
        senderId: sender.id,
        createdAt: new Date(),
    };

    conversation.messages.push(newMessage);

    // Phát sự kiện để UI tự cập nhật
    chatEvents.emit('newMessage', { conversationId, message: newMessage });

    return newMessage;
};

