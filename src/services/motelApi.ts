import type {Motel, MotelFilters, RelatedArticle, SimplifiedMotel, TagLink} from '../types';
import {v4 as uuidv4} from "uuid";
import {mockLandlords} from "./authApi.ts";
// Mock data
type MotelFormData = Omit<Motel, 'id' | 'createdAt'>;

// const staticMotels: Motel[] = motelDataFromJSON.map((motelJson, index) => {
//     const owner = mockLandlords[index % mockLandlords.length];
//
//     return {
//         id: `motel-${motelJson.id}`,
//         title: motelJson.owner.fullName.startsWith('Phòng trọ') ? motelJson.owner.fullName : `Phòng trọ chính chủ ${motelJson.owner.fullName}`,
//         description: motelJson.description,
//         price: {
//             value: motelJson.price,
//             unit: 'tháng'
//         },
//         area: motelJson.area,
//         images: [`/motel_images/motel_${motelJson.id}.jpg`],
//         city: motelJson.city,
//         district: 'Uông Bí',
//         amenities: motelJson.amenities,
//         status: 'published',
//         createdAt: new Date(Date.now() - (index + 30) * 1000 * 60 * 60 * 24), // Đẩy thời gian về quá khứ
//         specs: { capacity: 2 },
//         owner: {
//             id: owner.id,
//             fullName: owner.fullName,
//             avatar: owner.avatar,
//             phoneNumber: owner.phoneNumber
//         }
//     };
// });

export let allMotels: Motel[] = Array.from({length: 35}, (_, i) => {
    const owner = mockLandlords[i % mockLandlords.length];

    const statuses: Motel['status'][] = ['published', 'published', 'published', 'rented', 'pending', 'draft'];
    const areas = [18, 20, 22, 25, 28, 30, 35];
    const prices = [1800000, 2000000, 2200000, 2500000, 2800000, 3000000];
    const amenitiesPool = ['Full nội thất', 'Gần trường', 'Giờ giấc tự do', 'Điều hòa', 'Nóng lạnh', 'Wifi', "Chỗ để xe", "An ninh tốt"];
    const selectedAmenities = amenitiesPool.sort(() => 0.5 - Math.random()).slice(0, 3 + Math.floor(Math.random() * 4));
    const districts = ['Quang Trung', 'Trưng Vương', 'Nam Khê', 'Phương Đông', 'Phương Nam', 'Bắc sơn', 'Thanh sơn', 'Vàng Danh', 'Thượng Yên Công'];


    return {
        id: uuidv4(),
        title: `Phòng trọ cao cấp gần trung tâm của ${owner.fullName}`,
        description: `Mô tả chi tiết về phòng trọ. Vị trí thuận lợi tại Hạ Long, Quảng Ninh. An ninh đảm bảo, không gian sạch sẽ, thoáng mát. Liên hệ ngay chủ nhà ${owner.fullName} để xem phòng.`,
        price: {value: prices[i % prices.length], unit: 'tháng'},
        area: areas[i % areas.length],
        images: [`/motel_images/image_${i + 1}.jpg`],
        city: 'Uông Bí',
        district: districts[i % districts.length],
        amenities: selectedAmenities,
        status: statuses[i % statuses.length],
        createdAt: new Date(Date.now() - i * 1000 * 60 * 60 * 24),
        specs: {capacity: Math.floor(Math.random() * 4)},
        owner: {
            id: owner.id,
            fullName: owner.fullName,
            avatar: owner.avatar,
            phoneNumber: owner.phoneNumber
        }
    }
});

export const fetchAllMotels = async (filters: MotelFilters): Promise<Motel[]> => {
    console.log("API: Fetching PUBLIC motels with filters...", filters);
    await new Promise(r => setTimeout(r, 500));
    return [...allMotels.filter(motel => motel.status === 'published')];
};

export const fetchAllMotelsForAdmin = async (): Promise<Motel[]> => {
    await new Promise(r => setTimeout(r, 500));
    return [...allMotels];
};

export const fetchMotelById = async (motelId: string): Promise<Motel | undefined> => {
    console.log(`API Layer: Fetching motel with ID: ${motelId}`);
    await new Promise(resolve => setTimeout(resolve, 300));
    return allMotels.find(motel => motel.id === motelId);
};

export const fetchMotelsByIds = async (ids: string[]): Promise<Motel[]> => {
    if (ids.length === 0) return [];
    await new Promise(r => setTimeout(r, 400));
    return allMotels.filter(motel => ids.includes(motel.id));
};

// CREATE
export const createMotel = async (data: MotelFormData): Promise<Motel> => {
    await new Promise(r => setTimeout(r, 500));
    const newMotel: Motel = {...data, id: uuidv4(), createdAt: new Date(), status: 'published'};
    allMotels.unshift(newMotel);
    return newMotel;
};

// UPDATE
export const updateMotel = async (data: Partial<Motel> & { id: string }): Promise<Motel> => {
    await new Promise(r => setTimeout(r, 500));
    const index = allMotels.findIndex(m => m.id === data.id);
    if (index === -1) throw new Error('Không tìm thấy phòng trọ');
    allMotels[index] = {...allMotels[index], ...data};
    return allMotels[index];
};

// DELETE
export const deleteMotel = async (motelId: string): Promise<{ id: string }> => {
    await new Promise(r => setTimeout(r, 500));
    allMotels = allMotels.filter(m => m.id !== motelId);
    return {id: motelId};
};

export const fetchFeaturedMotels = async (): Promise<Motel[]> => {
    console.log("API: Fetching featured motels...");
    await new Promise(r => setTimeout(r, 800)); // Giả lập độ trễ mạng
    return allMotels
        .filter(motel => motel.status === 'published')
        .slice(0, 3);
};

// --- API cho Bài viết liên quan ---
export const fetchRelatedArticles = async (): Promise<RelatedArticle[]> => {
    await new Promise(r => setTimeout(r, 300));
    return [
        {id: 'a1', title: 'Cẩm nang Công Bố: Top 5 quán ăn vặt', url: '#', imageUrl: '/motel_images/image_5.jpg'},
        {id: 'a2', title: 'Mẹo hay cho SV: Cách di chuyển bằng xe bus?', url: '#', imageUrl: '/motel_images/image_6.jpg'},
        {id: 'a3', title: 'Khám phá: Cuối tuần đi đâu gần Hồ Yên...', url: '#', imageUrl: '/motel_images/image_7.jpg'},
    ];
};

// --- API cho Tin đăng cùng khu vực ---
// (motelId dùng để tìm các tin lân cận)
export const fetchNearbyMotels = async (_motelId: string): Promise<SimplifiedMotel[]> => {
    await new Promise(r => setTimeout(r, 400));
    return [
        {
            id: 'm101',
            title: 'Phòng trọ giá rẻ, P.Vàng Danh',
            price: 1800000,
            url: '#',
            imageUrl: '/motel_images/image_10.jpg'
        },
        {
            id: 'm102',
            title: 'Studio mini gần Vincom+',
            price: 2500000,
            url: '#',
            imageUrl: '/motel_images/image_11.jpg'
        },
    ];
};

// --- API cho Tin mới cập nhật ---
export const fetchLatestMotels = async (): Promise<SimplifiedMotel[]> => {
    await new Promise(r => setTimeout(r, 500));
    return [
        {id: 'm201', title: 'Nhà trọ phường Yên Thanh', price: 2100000, url: '#', imageUrl: '/motel_images/image_3.jpg'},
        {id: 'm202', title: 'Phòng trọ gần Bệnh viện Việt Nam - Thụy Điển', price: 2300000, url: '#', imageUrl: '/motel_images/image_4.jpg'},
    ];
};

// --- API cho Từ khóa ---
export const fetchPopularTags = async (): Promise<TagLink[]> => {
    await new Promise(r => setTimeout(r, 200));
    return [
        {name: 'Quang Trung', url: '/motels?district=Quang+Trung'},
        {name: 'Trưng Vương', url: '/motels?district=Trưng+Vương'},
        {name: 'Nam Khê', url: '/motels?district=Nam+Khê'},
        {name: 'Phương Đông', url: '/motels?district=Phương+Đông'},
        {name: 'Phương Nam', url: '/motels?district=Phương+Nam'},
        {name: 'Bắc Sơn', url: '/motels?district=Bắc+Sơn'},
        {name: 'Thanh Sơn', url: '/motels?district=Thanh+Sơn'},
        {name: 'Vàng Danh', url: '/motels?district=Vàng+Danh'},
        {name: 'Thượng Yên Công', url: '/motels?commune=Thượng+Yên+Công'},
    ];
};

/**
 * Lấy tất cả các phòng trọ đang chờ duyệt
 */
export const fetchPendingMotels = async (): Promise<Motel[]> => {
    await new Promise(r => setTimeout(r, 500));
    return allMotels.filter(motel => motel.status === 'pending');
};

/**
 * Cập nhật trạng thái của một phòng trọ (helper function)
 */
const updateMotelStatus = async (motelId: string, newStatus: Motel['status']): Promise<Motel> => {
    await new Promise(r => setTimeout(r, 600));
    const index = allMotels.findIndex(m => m.id === motelId);
    if (index === -1) throw new Error('Không tìm thấy phòng trọ');

    allMotels[index].status = newStatus;
    console.log(`Admin action: Motel ${motelId} status updated to ${newStatus}`);
    return allMotels[index];
};

/**
 * Phê duyệt một tin đăng
 */
export const approveMotel = (motelId: string) => updateMotelStatus(motelId, 'published');

/**
 * Từ chối một tin đăng
 */
export const rejectMotel = (motelId: string) => updateMotelStatus(motelId, 'draft');