import type {Post} from "../types";
import {v4 as uuidv4} from "uuid";
import {postsData} from "./data/postsData.ts";
type PostFormData = Omit<Post, 'id' | 'slug' | 'publishedAt' | 'author'>;



let allPosts:  Post[] = postsData.map((post, i) => ({
    id: `${i + 1}`,
    slug: post.slug.replace("${i + 1}", `${i + 1}`),
    title: post.title.replace("${i + 1}", `${i + 1}`),
    excerpt: 'Trong thế giới phát triển web hiện đại, việc có một kiến trúc frontend vững chắc là chìa khóa...',
    imageUrl: `/motel_images/image_${i+1}.jpg`,
    author: {
        name: 'Admin',
        avatar: 'https://i.pravatar.cc/150?u=admin'
    },
    publishedAt: new Date(Date.now() - i * 1000 * 60 * 60 * 24 * 3).toISOString(),
    content: `<h2>Đây là nội dung chi tiết của bài viết số ${i + 1}</h2><p>Nội dung này được giả lập để phục vụ cho trang quản trị.</p>`,
    tags: ["motel", "tips", "renting"],
}));

// READ ALL
export const fetchAllPosts = async (): Promise<Post[]> => {
    await new Promise(r => setTimeout(r, 500));
    return allPosts.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
};

// READ BY ID
export const fetchPostBySlug = async (slug: string): Promise<Post | undefined> => {
    console.log(`API: Fetching post with slug: ${slug}`);
    await new Promise(resolve => setTimeout(resolve, 300));

    const post = allPosts.find(p => p.slug === slug);
    return post;
};

export const fetchPostsByIds = async (ids: string[]): Promise<Post[]> => {
    if (ids.length === 0) return [];
    await new Promise(r => setTimeout(r, 400));
    return allPosts.filter(post => ids.includes(post.id));
};

// CREATE
export const createPost = async (data: PostFormData, authorInfo: Post['author']): Promise<Post> => {
    await new Promise(r => setTimeout(r, 500));
    const newPost: Post = {
        ...data,
        id: uuidv4(),
        slug: `${data.title.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}`,
        publishedAt: new Date().toISOString(),
        author: authorInfo,
    };
    allPosts.unshift(newPost);
    return newPost;
};

// UPDATE
export const updatePost = async (data: Partial<Post> & { id: string }): Promise<Post> => {
    await new Promise(r => setTimeout(r, 500));
    const index = allPosts.findIndex(p => p.id === data.id);
    if (index === -1) throw new Error('Không tìm thấy bài viết');
    if (data.title) {
        data.slug = `${data.title.toLowerCase().replace(/\s+/g, '-')}-${data.id}`;
    }
    allPosts[index] = { ...allPosts[index], ...data };
    return allPosts[index];
};

// DELETE
export const deletePost = async (postId: string): Promise<{ id: string }> => {
    await new Promise(r => setTimeout(r, 500));
    allPosts = allPosts.filter(p => p.id !== postId);
    return { id: postId };
};