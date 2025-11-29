// Motel module

export interface SimplifiedUser {
    id: string;
    fullName: string;
    avatar?: string;
    phoneNumber?: string; // Thêm sđt nếu cần hiển thị ngay
}

export interface Motel {
    id: string;
    title: string;
    description: string;
    price: {
        value: number;
        unit: 'tháng' | 'ngày';
    };
    area: number;
    images: string[];
    city: string;
    district: string;
    amenities: string[];
    status: "published" | "pending" | "draft" | "rented";
    owner: SimplifiedUser;
    createdAt: Date;
    specs: {
        capacity: number;
    };
}

export interface MotelFilters {
    keyword?: string;
    city?: string;
    priceRange?: [number, number];
    areaRange?: [number, number];
    amenities?: string[];
}

// Dùng cho "Bài viết liên quan"
export interface RelatedArticle {
    id: string;
    title: string;
    url: string;
    imageUrl?: string;
}

// Dùng cho "Tin đăng cùng khu vực" và "Tin mới cập nhật"
export interface SimplifiedMotel {
    id: string;
    title: string;
    price: number;
    url: string;
    imageUrl?: string;
}

// Dùng cho "Xem theo từ khóa"
export interface TagLink {
    name: string;
    url: string;
}


// Marketplace module
export type ListingType = 'sell' | 'free' | 'trade';
export type ItemCondition = 'new' | 'like_new' | 'used';

export interface Item {
    id: string;
    title: string;
    description: string;
    images: string[];
    price: number;
    listingType: ListingType;
    condition: ItemCondition;
    category: 'furniture' | 'electronics' | 'kitchenware' | 'books' | 'clothing' | 'other';

    location: {
        building: string;
        floor: number;
    };

    seller: {
        id: string;
        name: string;
        avatar: string;
    };

    createdAt: Date;
}

export type ItemFiltersType = {
    keyword?: string;
    building?: string;
    category?: 'furniture' | 'electronics' | 'kitchenware' | 'books' | 'clothing' | 'other';
    condition?: ItemCondition;
    listingType?: 'all' | ListingType;
    priceRange?: [number, number];
};

// Blog module
export interface Post {
    id: string;
    slug: string; // Quan trọng cho URL
    title: string;
    excerpt: string;
    imageUrl: string;
    author: {
        name: string;
        avatar: string;
    };
    publishedAt: string;
    content: string;
    tags: string[];
}

// Auth module
export interface User {
    id: string;
    fullName: string;
    email: string;
    age?: number;
    phoneNumber?: string;
    avatar?: string;
    role: Role;
    permissions: PermissionName[];
    gender?: 'male' | 'female' | 'other';
    address?: string;

}

export interface LoginCredentials {
    email: string;
    password: string;
}

export interface RegisterFormData {
    email: string;
    password: string;
    confirmPassword?: string;
    fullName: string;
    gender?: 'male' | 'female' | 'other';
    age?: number;
    address?: string;
    phoneNumber?: string;
}

// Admin module
export interface RecentListing {
    id: string;
    title: string;
    price: number;
    status: 'active' | 'rented' | 'pending';
}

export interface DashboardStats {
    totalListings: number;
    activeListings: number;
    totalRevenue: number;
    newMessages: number;
    revenueByMonth: { name: string; revenue: number }[];
    recentListings: RecentListing[];
}

// Dashboard
export interface TrendDataPoint {
    day: string;
    value: number;
}

export interface StatCardData {
    title: string;
    total: number | string;
    dayValue: number;
    trend: TrendDataPoint[];
}

export interface NewListingsTrendData {
    month: string;
    motels: number;
    items: number;
}

export interface TopListingItem {
    rank: number;
    title: string;
    views: number;
}

export interface AdminDashboardData {
    totalListings: StatCardData;
    listingViews: StatCardData;
    occupancyRate: StatCardData;
    newUsers: StatCardData;
    newListingsTrend: NewListingsTrendData[];
    topViewedListings: TopListingItem[];
}

// Comment
export interface Comment {
    id: number;
    resourceId: string | number;
    content: string;
    author: { id: string; name: string; avatar: string; };
    createdAt: Date;
    parentId: number | null;
}

export interface CommentWithChildren extends Comment {
    children: CommentWithChildren[];
}

// Saved
export interface DisplayCardData {
    id: string | number;
    type: 'Phòng trọ' | 'Đồ cũ' | 'Blog';
    label?: string;
    title: string;
    price: number;
    imageUrl: string;
    subInfo: string;
    link: string;
    createdAt: Date;
}

// Permisson and role
export type UserRole = 'renter' | 'landlord' | 'admin';
export type PermissionName = string;

export interface Role {
    id: number;
    name: UserRole;
    permissions: PermissionName[];
}

export interface Permission {
    id: number;
    name: PermissionName;
    description: string;
}

// Filter
export interface FilterConfig {
    type: 'search' | 'select';
    name: string;
    label: string;
    placeholder: string;
    options?: { value: string; label: string }[];
}

// Messenger
export interface Message {
    id: number;
    text: string;
    senderId: string;
    createdAt: Date;
}

export interface ConversationSummary {
    messages: Message[];
    id: string;
    otherUser: {
        id: string;
        fullName: string;
        avatar?: string;
    };
    lastMessage: Message;
    unreadCount: number;
}

// Booking
export interface Booking {
    id: string;
    motelId: string;
    tenantId: string;
    ownerId: string;
    startDate: string;
    endDate: string;
    numberOfGuests: number;
    depositAmount: number;
    guestInfo: {
        fullName: string;
        phoneNumber: string;
        email: string;
    };
    status: 'PENDING_APPROVAL' | 'APPROVED_PENDING_DEPOSIT' | 'CONFIRMED' | 'REJECTED' | 'CANCELLED';
    createdAt: string;
    updatedAt: string;
}

export interface PopulatedBooking extends Omit<Booking, 'motelId' | 'tenantId' | 'ownerId'> {
    motel: Motel;
    tenant: SimplifiedUser;
    owner: SimplifiedUser;
}

// Transaction
export interface Transaction {
    id: string;
    bookingId: string;
    totalAmountReceived: number;
    commissionFeeEarned: number;
    payoutDueToLandlord: number;
    payoutStatus: 'PENDING_PAYOUT' | 'PAID_OUT';
}

export interface PopulatedTransaction extends Transaction {
    bookingInfo: PopulatedBooking | null;
}