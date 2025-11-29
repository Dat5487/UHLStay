import {Avatar, Tooltip } from 'antd';
import { Comment } from '@ant-design/compatible';
import { formatDistanceToNow } from 'date-fns';
import { vi } from 'date-fns/locale';
import type {CommentWithChildren} from "../../../types";
import {type ReactNode} from "react";

interface CommentItemProps {
    comment: CommentWithChildren;
    onReply: (id: number) => void;
    replyingToId: number | null;
    replyFormNode: ReactNode;
}

const CommentItem = ({ comment, onReply, replyingToId, replyFormNode }: CommentItemProps) => {
    const actions = [<span key="reply" onClick={() => onReply(comment.id)}>Trả lời</span>];

    return (
        <Comment
            actions={actions}
            author={<strong>{comment.author.name}</strong>}
            avatar={<Avatar src={comment.author.avatar} alt={comment.author.name} />}
            content={<p>{comment.content}</p>}
            datetime={
                <Tooltip title={new Date(comment.createdAt).toLocaleString('vi-VN')}>
                    <span>{formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true, locale: vi })}</span>
                </Tooltip>
            }
        >
            {replyingToId === comment.id && replyFormNode}
            {comment.children?.map(reply => (
                <CommentItem
                    key={reply.id}
                    comment={reply}
                    onReply={onReply}
                    replyingToId={replyingToId}
                    replyFormNode={replyFormNode}
                />
            )
            )
            }
        </Comment>
    );
};

export default CommentItem;