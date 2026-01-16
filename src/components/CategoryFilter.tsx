'use client';

import { Category, CATEGORY_INFO } from '@/types';

interface CategoryFilterProps {
    selectedCategory: Category | null;
    onCategoryChange: (category: Category | null) => void;
}

export function CategoryFilter({ selectedCategory, onCategoryChange }: CategoryFilterProps) {
    const categories = Object.entries(CATEGORY_INFO) as [Category, typeof CATEGORY_INFO[Category]][];

    return (
        <div className="flex flex-wrap gap-2">
            <button
                onClick={() => onCategoryChange(null)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${selectedCategory === null
                        ? 'bg-gradient-brand text-white shadow-clay'
                        : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
                    }`}
            >
                All Categories
            </button>
            {categories.map(([key, info]) => (
                <button
                    key={key}
                    onClick={() => onCategoryChange(key)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-2 ${selectedCategory === key
                            ? 'bg-gradient-brand text-white shadow-clay'
                            : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
                        }`}
                >
                    <span>{info.emoji}</span>
                    <span>{info.label}</span>
                </button>
            ))}
        </div>
    );
}
