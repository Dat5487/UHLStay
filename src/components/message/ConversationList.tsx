import { useQuery } from "@tanstack/react-query";
import {fetchConversations} from "../../services/messengerApi.ts";
import {Avatar, Badge, List, Typography} from "antd";

interface ConversationListProps {
    activeConvId: string | null;
    onSelectConv: (convId: string) => void;
}

const ConversationList = ({ activeConvId, onSelectConv }: ConversationListProps) => {
    const { data: conversations } = useQuery({
        queryKey: ['conversations'],
        queryFn: fetchConversations,
        refetchInterval: 15000,
    });

    return (
        <List
            itemLayout="horizontal"
            dataSource={conversations}
            renderItem={item => (
                <List.Item
                    onClick={() => onSelectConv(item.id)}
                    className={`p-4 border-l-4 ${activeConvId === item.id ? 'border-blue-500 bg-blue-50' : 'border-transparent'}`}
                >
                    <List.Item.Meta
                        avatar={<Avatar src={item.otherUser.avatar} />}
                        title={<Typography.Text strong>{item.otherUser.fullName}</Typography.Text>}
                        description={<Typography.Text ellipsis type={item.unreadCount > 0 ? undefined : 'secondary'}>{item.lastMessage.text}</Typography.Text>}
                    />
                    {item.unreadCount > 0 && <Badge count={item.unreadCount} />}
                </List.Item>
            )}
        />
    );
};
export default ConversationList;