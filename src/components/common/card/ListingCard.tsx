import React from 'react';
import type {SimplifiedMotel} from "../../../types";

const ListingCard: React.FC<{ motel: SimplifiedMotel }> = ({ motel }) => (
    <a href={motel.url} className="flex items-center space-x-4 p-2 rounded-md hover:bg-gray-800">
        <div className="w-20 h-16 rounded flex-shrink-0 overflow-hidden bg-gray-200 flex items-center justify-center">
            {motel.imageUrl ? (
                <img
                    src={motel.imageUrl}
                    alt={motel.title}
                    className="object-cover w-full h-full rounded"
                    loading="lazy"
                />
            ) : (
                <span className="text-xs text-gray-400">No image</span>
            )}
        </div>
        <div>
            <p className="text-black text-lg !font-bold line-clamp-2">{motel.title}</p>
            <p className="text-green-500 text-lg font-bold mt-1">{motel.price.toLocaleString()} VNĐ</p>
        </div>
    </a>
);
export default ListingCard;