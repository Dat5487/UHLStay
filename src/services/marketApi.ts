import type {Item, ItemCondition, ItemFiltersType, ListingType} from "../types";
import {v4 as uuidv4} from "uuid";

const itemTemplates = [
    { title: 'Bàn làm việc gỗ thông', category: 'furniture' as const },
    { title: 'Tai nghe Sony WH-1000XM4', category: 'electronics' as const },
    { title: 'Nồi cơm Philips', category: 'kitchenware' as const },
    { title: 'Bộ sách giáo trình "Lập trình Web"', category: 'books' as const },
    { title: 'Ghế công thái học Ergohuman', category: 'furniture' as const },
    { title: 'Bộ nồi chảo Sunhouse', category: 'kitchenware' as const },
    { title: 'Tiểu thuyết "Nhà Giả Kim"', category: 'books' as const },
    { title: 'Áo khoác gió Uniqlo', category: 'clothing' as const },
    { title: 'Bình giữ nhiệt Lock&Lock', category: 'other' as const },
] as const;

// Helper function to get images based on category
const getImagesByCategory = (category: string, index: number): string[] => {
    const basePath = '/item_images/img_PNG';
    
    switch (category) {
        case 'furniture':
            if (index % 2 === 0) {
                return [`${basePath}/table/Ảnh bàn-${(index % 8) + 1}.png`];
            } else {
                return [`${basePath}/chair/Ảnh ghế-${(index % 6) + 1}.png`];
            }
        case 'electronics':
            return [`${basePath}/electronics/Ảnh tai nghe-${(index % 8) + 1}.png`];
        case 'kitchenware':
            if (index % 2 === 0) {
                return [`${basePath}/rice-cooker/Nồi cơm-${(index % 3) + 1}.png`];
            } else {
                return [`${basePath}/pan/Bộ nồi chảo-${(index % 3) + 1}.png`];
            }
        case 'books':
            return [`${basePath}/books/Sách-${(index % 9) + 1}.png`];
        case 'clothing':
            return [`https://source.unsplash.com/random/800x600?clothing,product&sig=${index}`];
        case 'other':
            return [`https://source.unsplash.com/random/800x600?product&sig=${index}`];
        default:
            return [`https://source.unsplash.com/random/800x600?product&sig=${index}`];
    }
};

const conditions: ItemCondition[] = ['new', 'like_new', 'used'];
const listingTypes: ListingType[] = ['sell', 'free', 'trade'];
const buildings: string[] = [
    "Trần Thị Thu Huyền",
    "Trần Thị Như Hoa",
    "Trần Ngọc Tuấn",
    "Nguyễn Đồng Tuyên",
    "Nguyễn Đồng Kiên",
    "Đinh Thị Phượng",
    "Hà Thị Dung",
    "Nguyễn Văn Dũng",
    "Nguyễn Thị Đào",
    "Phạm Đức Kế",
    "Nguyễn Thị Thanh Trà",
    "Vũ Thùy Dung",
    "Phạm Hồng Huấn",
    "Phạm Thu Hường",
    "Hương Vương", //15
    "Dương Thị Phượng",
    "Nguyễn Thị Phương Huyền",
    "Phạm Văn Biến",
    "Lê Văn Hùng",
    "Như Quỳnh",
    "Lê Văn Lộc",
    "Trương Văn Hùng",
    "Nguyễn Minh Thúy",
    "Phạm Văn Đường",
    "Nguyễn Thị Phượng",
    "Nhà trọ Hà Lê",
    "Ngọc Hà",
    "Nguyễn Đăng Vương",
    "KSSV Thành Duy",
    "Nguyễn Duy Khánh",
];


let allItems: Item[] = Array.from({ length: 40 }, (_, i) => {
    const template = itemTemplates[i % itemTemplates.length];
    const currentCondition = conditions[i % conditions.length];
    const currentListingType = listingTypes[i % listingTypes.length];
    const price = currentListingType === 'free' ? 0 : 50000 + Math.floor(Math.random() * 50) * 100000;

    return {
        id: `${i + 1}`,
        title: `${template.title} #${i + 1}`,
        description: `Do không còn nhu cầu sử dụng, mình cần pass lại món đồ này. Tình trạng còn rất tốt, ${currentCondition === 'like_new' ? 'gần như mới' : 'đã qua sử dụng một thời gian'}. Liên hệ mình để xem trực tiếp nhé.`,
        images: getImagesByCategory(template.category, i),
        price: price,
        listingType: currentListingType,
        condition: currentCondition,
        category: template.category,
        location: {
            building: buildings[i % buildings.length],
            floor: (i % 15) + 1,
        },
        seller: {
            id: `user-${i + 1}`,
            name: `Người bán ${i + 1}`,
            avatar: `https://i.pravatar.cc/150?u=seller${i}`,
        },
        createdAt: new Date(Date.now() - i * 1000 * 60 * 60 * 20), // Tạo ra các thời điểm khác nhau
    };
});

export const fetchAllItems = async (filters: ItemFiltersType): Promise<Item[]> => {
    console.log("API Layer (Marketplace): Filtering items with...", filters);
    await new Promise(resolve => setTimeout(resolve, 400));
    
    // Apply filters to the items
    let filteredItems = [...allItems];
    
    // Filter by keyword (search in title and description)
    if (filters.keyword && filters.keyword.trim()) {
        const keyword = filters.keyword.toLowerCase().trim();
        filteredItems = filteredItems.filter(item => 
            item.title.toLowerCase().includes(keyword) || 
            item.description.toLowerCase().includes(keyword)
        );
    }
    
    // Filter by building
    if (filters.building) {
        filteredItems = filteredItems.filter(item => 
            item.location.building === filters.building
        );
    }
    
    // Filter by category
    if (filters.category) {
        filteredItems = filteredItems.filter(item => 
            item.category === filters.category
        );
    }
    
    // Filter by condition
    if (filters.condition) {
        filteredItems = filteredItems.filter(item => 
            item.condition === filters.condition
        );
    }
    
    // Filter by listing type
    if (filters.listingType && filters.listingType !== 'all') {
        filteredItems = filteredItems.filter(item => 
            item.listingType === filters.listingType
        );
    }
    
    // Filter by price range
    if (filters.priceRange && filters.priceRange.length === 2) {
        const [minPrice, maxPrice] = filters.priceRange;
        filteredItems = filteredItems.filter(item => {
            // Convert price from VND to thousands for comparison
            const priceInThousands = item.price / 1000;
            return priceInThousands >= minPrice && priceInThousands <= maxPrice;
        });
    }
    
    console.log(`Filtered ${filteredItems.length} items from ${allItems.length} total items`);
    return filteredItems;
};

export const fetchAllItemsForAdmin = async (): Promise<Item[]> => {
    await new Promise(r => setTimeout(r, 500));
    return [...allItems];
};

// READ BY ID
export const fetchItemById = async (itemId: string): Promise<Item | undefined> => {
    console.log(`API Layer: Fetching item with ID: ${itemId}`);
    await new Promise(resolve => setTimeout(resolve, 300));
    return allItems.find(item => item.id === itemId); // Phép so sánh giờ đã đúng
}

export const fetchItemsByIds = async (ids: string[]): Promise<Item[]> => {
    if (ids.length === 0) return [];
    await new Promise(r => setTimeout(r, 400));
    return allItems.filter(item => ids.includes(item.id));
};

// CREATE
export const createItem = async (data: Omit<Item, 'id' | 'createdAt' | 'seller'>, sellerInfo: Item['seller']): Promise<Item> => {
    await new Promise(r => setTimeout(r, 500));
    
    // Ensure images are properly formatted as strings
    const processedImages = data.images?.map((img: any) => {
        if (typeof img === 'string') {
            return img;
        }
        // If it's a file object or blob URL, convert to a mock URL for demo
        if (img && typeof img === 'object' && img.url) {
            return img.url;
        }
        // For blob URLs, we'll keep them as is for demo purposes
        return img;
    }) || [];
    
    const newItem: Item = { 
        ...data, 
        images: processedImages,
        id: uuidv4(), 
        createdAt: new Date(), 
        seller: sellerInfo 
    };
    
    allItems.unshift(newItem);
    return newItem;
};

// UPDATE
export const updateItem = async (data: Partial<Item> & { id: string }): Promise<Item> => {
    await new Promise(r => setTimeout(r, 500));
    const index = allItems.findIndex(i => i.id === data.id);
    if (index === -1) throw new Error('Không tìm thấy sản phẩm');
    allItems[index] = { ...allItems[index], ...data };
    return allItems[index];
};

// DELETE
export const deleteItem = async (itemId: string): Promise<{ id: string }> => {
    await new Promise(r => setTimeout(r, 500));
    allItems = allItems.filter(i => i.id !== itemId);
    return { id: itemId };
};