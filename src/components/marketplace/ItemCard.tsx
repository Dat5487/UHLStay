import {Card, Tag, Typography} from 'antd';
import type {Item} from '../../types';
import {Link} from "react-router-dom";

const { Title, Text } = Typography;

// Định nghĩa props cho component, nó sẽ nhận vào một object motel
interface ItemCardProps {
    item: Item;
}

export default function ItemCard({ item }: ItemCardProps) {
    const hasMultipleImages = item.images && item.images.length > 1;
    
    const renderConditionTag = (condition: Item['condition']) => {
        switch (condition) {
            case 'new':
                return <Tag color="blue">Mới</Tag>;
            case 'like_new':
                return <Tag color="cyan">Như mới</Tag>;
            case 'used':
                return <Tag>Đã dùng</Tag>;
            default:
                return null;
        }
    };
    return (
       <Link to={`/items/${item.id}`}>
           <Card
               hoverable
               cover={
                   <div className="relative">
                       <img
                           alt={item.title}
                           src={item.images?.[0] || 'https://via.placeholder.com/400x300?text=No+Image'}
                           className="h-48 w-full object-cover"
                       />
                       {/* Image count badge */}
                       {hasMultipleImages && (
                           <div className="absolute top-2 right-2 bg-black bg-opacity-70 text-white px-2 py-1 rounded-full text-xs font-medium">
                               +{item.images.length - 1} ảnh
                           </div>
                       )}
                       {/* Small preview of additional images */}
                       {hasMultipleImages && item.images.length > 1 && (
                           <div className="absolute bottom-2 right-2 flex space-x-1">
                               {item.images.slice(1, 4).map((image, index) => (
                                   <img
                                       key={index}
                                       src={image}
                                       alt={`Preview ${index + 2}`}
                                       className="w-8 h-8 rounded object-cover border-2 border-white"
                                   />
                               ))}
                               {item.images.length > 4 && (
                                   <div className="w-8 h-8 rounded bg-black bg-opacity-70 text-white text-xs flex items-center justify-center border-2 border-white">
                                       +{item.images.length - 4}
                                   </div>
                               )}
                           </div>
                       )}
                   </div>
               }
               actions={[
                   <Text strong className="text-blue-600">{`Tòa ${item.location.building}`}</Text>,
               ]}
           >
               <Card.Meta
                   title={<Title level={5} className="truncate whitespace-normal h-12">{item.title}</Title>}
                   description={
                       <div className="flex justify-between items-center">
                           {item.listingType === 'free' ? (
                               <Tag color="green" className="text-base">MIỄN PHÍ</Tag>
                           ) : (
                               <Text strong className="text-lg text-red-500">
                                   {item.price.toLocaleString()}đ
                               </Text>
                           )}
                           {renderConditionTag(item.condition)}
                       </div>
                   }
               />
           </Card>
       </Link>
    );
}