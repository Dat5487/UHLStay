import {Card, Tag, Typography} from 'antd';
import type {Motel} from '../../types';
import {Link} from "react-router-dom";


// Định nghĩa props cho component, nó sẽ nhận vào một object motel
interface MotelCardProps {
    motel: Motel;
}

const MotelCard = ({ motel }: MotelCardProps) => {
    const hasMultipleImages = motel.images && motel.images.length > 1;

    return (
        <Link to={`/motels/${motel.id}`}>
            <Card
                hoverable
                cover={
                    <div className="relative">
                        <img
                            alt={motel.title}
                            src={motel.images?.[0] || 'https://via.placeholder.com/400x300?text=No+Image'}
                            className="h-48 w-full object-cover"
                        />
                        {/* Image count badge */}
                        {hasMultipleImages && (
                            <div className="absolute top-2 right-2 bg-black bg-opacity-70 text-white px-2 py-1 rounded-full text-xs font-medium">
                                +{motel.images.length - 1} ảnh
                            </div>
                        )}
                        {/* Small preview of additional images */}
                        {hasMultipleImages && motel.images.length > 1 && (
                            <div className="absolute bottom-2 right-2 flex space-x-1">
                                {motel.images.slice(1, 4).map((image, index) => (
                                    <img
                                        key={index}
                                        src={image}
                                        alt={`Preview ${index + 2}`}
                                        className="w-8 h-8 rounded object-cover border-2 border-white"
                                    />
                                ))}
                                {motel.images.length > 4 && (
                                    <div className="w-8 h-8 rounded bg-black bg-opacity-70 text-white text-xs flex items-center justify-center border-2 border-white">
                                        +{motel.images.length - 4}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                }
            >
                <Typography.Title level={5} className="truncate">{motel.title}</Typography.Title>
                <Typography.Text strong className="text-red-500 text-lg">
                    {motel.price.value.toLocaleString()} VNĐ/tháng
                </Typography.Text>
                <div className="mt-2">
                    <Tag>{motel.area} m²</Tag>
                    <Tag>{motel.district}, {motel.city}</Tag>
                </div>
            </Card>
        </Link>
    );
}
export default MotelCard;