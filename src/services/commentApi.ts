import type {Comment} from "../types";

type CommentFromStorage = Omit<Comment, 'createdAt'> & {
    createdAt: string;
};
const COMMENTS_STORAGE_KEY = import.meta.env.VITE_COMMENTS_STORAGE_KEY || 'unistay_mock_comments_default';

const getCommentsFromStorage = (): Comment[] => {
    try {
        const data = localStorage.getItem(COMMENTS_STORAGE_KEY);
        if (data) {
            const parsedData = JSON.parse(data) as CommentFromStorage[];
            return parsedData.map((comment) => ({
                ...comment,
                createdAt: new Date(comment.createdAt),
            }));
        }
        return [];
    } catch (error) {
        console.error("Lỗi khi đọc comments từ localStorage:", error);
        return [];
    }
};

const saveCommentsToStorage = (comments: Comment[]) => {
    localStorage.setItem(COMMENTS_STORAGE_KEY, JSON.stringify(comments));
};

if (getCommentsFromStorage().length === 0) {
    const initialComments: Comment[] = [
        {
            id: 1,
            resourceId: 1,
            content: 'Phòng này còn không bạn ơi?',
            author: {id: '3', name: 'Sinh Viên An', avatar: '...'},
            createdAt: new Date(),
            parentId: null
        },
        {
            id: 2,
            resourceId: 1,
            content: 'Còn bạn nhé, bạn qua xem lúc nào được?',
            author: {id: '2', name: 'Chủ Nhà Lan', avatar: '...'},
            createdAt: new Date(),
            parentId: 1
        },
    ];
    saveCommentsToStorage(initialComments);
}


export const fetchComments = async (resourceId: string | number): Promise<Comment[]> => {
    await new Promise(r => setTimeout(r, 300));
    const allComments = getCommentsFromStorage();
    return allComments
        .filter(c => String(c.resourceId) === String(resourceId))
        .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime()); // Sắp xếp từ cũ đến mới
};

export const postComment = async (
    data: { content: string; resourceId: string | number; author: Comment['author']; parentId: number | null; }
): Promise<Comment> => {
    await new Promise(r => setTimeout(r, 300));
    const allComments = getCommentsFromStorage();

    const newComment: Comment = {
        id: Date.now(),
        content: data.content,
        resourceId: data.resourceId,
        author: data.author,
        parentId: data.parentId,
        createdAt: new Date(),
    };

    allComments.push(newComment);
    saveCommentsToStorage(allComments);

    return newComment;
};