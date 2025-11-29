import React, { useState } from 'react';
import { Image, Row, Col } from 'antd';

interface MotelImageGalleryProps {
    images: string[];
}

const MotelImageGallery: React.FC<MotelImageGalleryProps> = ({ images }) => {
    const [selectedImage, setSelectedImage] = useState(images[0]);

    if (!images || images.length === 0) {
        return (
            <Image
                width="100%"
                src={'https://via.placeholder.com/800x600?text=No+Image'}
                className="rounded-lg"
            />
        );
    }



    // Lấy 4 ảnh đầu tiên để làm thumbnail
    const thumbnailImages = images.slice(0, 4);

    return (
        <Image.PreviewGroup items={images}>
            {/* Ảnh chính */}
            <Image
                width="100%"
                src={selectedImage}
                className="rounded-lg object-cover cursor-pointer"
                style={{ aspectRatio: '4/3' }}
            />
            {/* Thumbnails */}
            <Row gutter={[8, 8]} className="mt-2">
                {thumbnailImages.map((image, index) => (
                    <Col key={index} span={6}>
                        <Image
                            src={image}
                            preview={{ visible: false }}
                            className={`
                                rounded-md object-cover cursor-pointer w-full transition-all duration-200
                                ${selectedImage === image ? 'ring-2 ring-blue-500' : 'opacity-70 hover:opacity-100'}
                            `}
                            style={{ height: '100px' }}
                            onClick={() => setSelectedImage(image)}
                        />
                    </Col>
                ))}
            </Row>
        </Image.PreviewGroup>
    );
};

export default MotelImageGallery;