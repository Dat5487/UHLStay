import {Avatar, Badge, Empty, Input, Layout, List, Skeleton} from "antd";
import ChatWindow from "./ChatWindow.tsx";
import {useRealtimeChatUpdater} from "../../hooks/useRealTimeChatUpdater.ts";
import {useQuery} from "@tanstack/react-query";
import {fetchConversations} from "../../services/messengerApi.ts";
import type {ConversationSummary} from "../../types";
import {useEffect, useState} from "react";

const {Sider, Content} = Layout;

const MessageContent = () => {
    const [activeConvId, setActiveConvId] = useState<string | null>(null);
    useRealtimeChatUpdater(activeConvId);
    const { data: conversations, isLoading } = useQuery({
        queryKey: ['conversations'],
        queryFn: fetchConversations,
    });

    useEffect(() => {
        if (!activeConvId && conversations && conversations.length > 0) {
            setActiveConvId(conversations[0].id);
        }
    }, [conversations, activeConvId]);

    const activeConversation = conversations?.find(c => c.id === activeConvId);

    return (
        <div className="w-[80vw] max-w-[1100px] h-[75vh] bg-white rounded-lg shadow-lg overflow-hidden">
            <Layout className="h-full">
                <Sider width={300} theme="light" className="border-r flex flex-col">
                    <div className="p-4 border-b">
                        <Input.Search placeholder="Tìm kiếm trò chuyện..." />
                    </div>
                    {isLoading ? <div className="p-4"><Skeleton active avatar /></div> : (
                        <List
                            className="overflow-y-auto flex-1"
                            itemLayout="horizontal"
                            dataSource={conversations}
                            renderItem={(item: ConversationSummary) => (
                                <List.Item
                                    onClick={() => setActiveConvId(item.id)}
                                    className={`!px-4 !py-3 cursor-pointer border-l-4 ${activeConvId === item.id ? 'border-blue-500 bg-blue-50' : 'border-transparent hover:bg-gray-100'}`}
                                >
                                    <List.Item.Meta
                                        avatar={<Avatar src={item.otherUser.avatar} />}
                                        title={item.otherUser.fullName}
                                        description={<p className="truncate">{item.lastMessage.text}</p>}
                                    />
                                    {item.unreadCount > 0 && <Badge count={item.unreadCount} />}
                                </List.Item>
                            )}
                        />
                    )}
                </Sider>
                <Layout>
                    <Content>
                        {activeConvId && activeConversation ? (
                            <ChatWindow
                                conversationId={activeConvId}
                                otherUser={activeConversation.otherUser}
                            />
                        ) : (
                            <Empty className="h-full flex flex-col justify-center items-center"
                                   description="Chọn một cuộc trò chuyện để bắt đầu" />
                        )}
                    </Content>
                </Layout>
            </Layout>
        </div>
    );
}
export default MessageContent;