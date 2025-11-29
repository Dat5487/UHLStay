import React from "react";

interface MotelLocationMapProps {
    city: string;
    district: string;
    className?: string;
    height?: number;
}

const MotelLocationMap: React.FC<MotelLocationMapProps> = ({ city, district, className, height = 180 }) => {
    const query = `${district}, ${city}`;
    const src = `https://www.google.com/maps?q=${encodeURIComponent(query)}&output=embed`;

    return (
        <div className={className}>
            <iframe
                title="Motel location map"
                src={src}
                width="100%"
                height={height}
                style={{ border: 0, borderRadius: 8 }}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
            />
        </div>
    );
};

export default MotelLocationMap;


