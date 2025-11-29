import React from 'react';
import type {RelatedArticle} from "../../../types";

const ArticleCard: React.FC<{ article: RelatedArticle }> = ({ article }) => (
    <a href={article.url} className="flex items-center space-x-3 p-2 rounded-md hover:bg-gray-800">
        <div className="w-16 h-12 bg-gray-700 rounded flex-shrink-0 overflow-hidden flex items-center justify-center">
            {article.imageUrl ? (
                <img
                    src={article.imageUrl}
                    alt={article.title}
                    className="object-cover w-full h-full rounded"
                    loading="lazy"
                />
            ) : (
                <span className="text-[10px] text-gray-300">No image</span>
            )}
        </div>
        <p className="text-black text-sm font-lg font-bold line-clamp-2">{article.title}</p>
    </a>
);
export default ArticleCard;