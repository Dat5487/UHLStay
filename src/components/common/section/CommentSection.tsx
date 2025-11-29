import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {useAppSelector} from "../../../store/hooks.ts";
import {selectCurrentUser} from "../../../store/slices/authSlice.ts";
import {fetchComments, postComment} from "../../../services/commentApi.ts";
import {Avatar, Empty, Form, message, Spin, Typography} from "antd";
import {Link} from "react-router-dom";
import {usePermissions} from "../../../hooks/usePermissions.ts";
import {useMemo, useState} from "react";
import type {CommentWithChildren} from "../../../types";
import CommentItem from "../item/CommentItem.tsx";
import CommentForm from "../form/CommentForm.tsx";
import {useRealtimeComments} from "../../../hooks/useRealtimeComments.ts";

const {Paragraph} = Typography;

interface CommentsSectionProps {
    resourceId: string | number;
}

const CommentsSection = ({resourceId}: CommentsSectionProps) => {
    const [mainForm] = Form.useForm();
    const [replyForm] = Form.useForm();
    const currentUser = useAppSelector(selectCurrentUser);
    const queryClient = useQueryClient();
    const {hasPermission} = usePermissions();
    const [replyingTo, setReplyingTo] = useState<number | null>(null);

    useRealtimeComments(resourceId);

    const queryKey = ['comments', resourceId];
    const {data: flatComments, isLoading} = useQuery({
        queryKey: queryKey,
        queryFn: () => fetchComments(resourceId),
    });

    const {mutate: addComment, isPending: isSubmittingComment} = useMutation({
        mutationFn: postComment,
        onSuccess: () => {
            message.success('Đã gửi bình luận!');
            queryClient.invalidateQueries({ queryKey });
            mainForm.resetFields();
            replyForm.resetFields();
            setReplyingTo(null);
        },
        onError: (err) => message.error(err.message),
    });

    const commentTree = useMemo(() => {
        if (!flatComments) return [];
        const map: { [key: number]: CommentWithChildren } = {};
        const roots: CommentWithChildren[] = [];

        flatComments.forEach(c => {
            map[c.id] = {...c, children: []}
        });
        flatComments.forEach(c => c.parentId && map[c.parentId] ? map[c.parentId].children.push(map[c.id]) : roots.push(map[c.id]));
        return roots;
    }, [flatComments]);

    const onFinishRootComment = ({ content }: { content: string }) => {
        if (!content?.trim() || !currentUser) return;
        addComment({
            content, resourceId, parentId: null,
            author: { id: currentUser.id, name: currentUser.fullName, avatar: currentUser.avatar || '' },
        });
    };

    const onFinishReply = ({ content }: { content: string }) => {
        if (!content?.trim() || !currentUser) return;
        addComment({
            content, resourceId, parentId: replyingTo,
            author: { id: currentUser.id, name: currentUser.fullName, avatar: currentUser.avatar || '' },
        });
    };

    const replyFormNode = (
        <div className="pl-12 pt-4">
            <CommentForm
                form={replyForm}
                onFinish={onFinishReply}
                isSubmitting={isSubmittingComment && replyingTo !== null}
            />
        </div>
    );

    return (
        <div className="mt-12">
            <h3 className="text-xl font-semibold mb-4">Bình luận
                ({hasPermission('comment:create') && flatComments?.length || 0})</h3>
            {hasPermission('comment:create') ? (
                <div className="flex items-start gap-4 mb-8 border-b pb-8">
                    <Avatar src={currentUser?.avatar} />
                    <div className="flex-grow">
                        <CommentForm
                            form={mainForm}
                            onFinish={onFinishRootComment}
                            isSubmitting={isSubmittingComment && replyingTo === null}
                        />
                    </div>
                </div>
            ) : (
                <Paragraph type="secondary" className="italic mb-8">
                    Vui lòng <Link to="/login" className="text-blue-500 hover:underline">đăng nhập</Link> để có thể bình luận.
                </Paragraph>
            )}
            {isLoading && <div className="text-center p-10"><Spin/></div>}
            {!isLoading && commentTree.length === 0 &&
                <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="Chưa có bình luận nào."/>}
            {hasPermission('comment:create') && commentTree.map(comment => (
                <CommentItem
                    key={comment.id}
                    comment={comment}
                    onReply={setReplyingTo}
                    replyingToId={replyingTo}
                    replyFormNode={replyFormNode}
                />
            ))}

        </div>
    );
};
export default CommentsSection;