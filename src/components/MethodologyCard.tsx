'use client';

import { Methodology, CATEGORY_INFO } from '@/types';
import { useState } from 'react';
import Link from 'next/link';

interface MethodologyCardProps {
    methodology: Methodology;
}

export function MethodologyCard({ methodology }: MethodologyCardProps) {
    const [upvotes, setUpvotes] = useState(methodology.upvotes);
    const [hasUpvoted, setHasUpvoted] = useState(false);

    const categoryInfo = CATEGORY_INFO[methodology.category];

    const handleUpvote = () => {
        if (!hasUpvoted) {
            setUpvotes(prev => prev + 1);
            setHasUpvoted(true);
        }
    };

    return (
        <article className="clay-card flex gap-4 group hover:shadow-lg transition-all duration-300">
            {/* Upvote Section */}
            <div className="flex-shrink-0">
                <button
                    onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleUpvote();
                    }}
                    className={`upvote-btn ${hasUpvoted ? 'bg-gradient-to-br from-brand-start/20 to-brand-mid/20' : ''}`}
                >
                    <span className="text-lg">▲</span>
                    <span className="text-sm">{upvotes}</span>
                </button>
            </div>

            {/* Content Section */}
            <div className="flex-1 min-w-0">
                {/* Header */}
                <div className="flex items-start justify-between gap-4 mb-3">
                    <div>
                        <Link
                            href={`/methodologies/${methodology.id}`}
                            className="text-xl font-semibold text-gray-900 mb-1 hover:text-brand-mid transition-colors block"
                        >
                            {methodology.name}
                        </Link>
                        <p className="text-sm text-gray-500">
                            by <span className="font-medium text-gray-700">{methodology.guestName}</span>
                        </p>
                    </div>
                    <span className="category-badge flex-shrink-0">
                        {categoryInfo.emoji} {categoryInfo.label}
                    </span>
                </div>

                {/* Summary */}
                <p className="text-gray-600 mb-4 leading-relaxed">
                    {methodology.summary}
                </p>

                {/* Principles Preview */}
                <div className="mb-4">
                    <h4 className="text-sm font-semibold text-gray-700 mb-2">Core Principles</h4>
                    <ul className="space-y-1">
                        {methodology.principles.slice(0, 3).map((principle, index) => (
                            <li key={index} className="flex items-start gap-2 text-sm text-gray-600">
                                <span className="text-brand-start font-semibold">{index + 1}.</span>
                                <span>{principle}</span>
                            </li>
                        ))}
                        {methodology.principles.length > 3 && (
                            <li className="text-sm text-brand-mid font-medium">
                                +{methodology.principles.length - 3} more...
                            </li>
                        )}
                    </ul>
                </div>

                {/* Quote */}
                {methodology.quote && (
                    <blockquote className="border-l-4 border-brand-mid pl-4 py-2 bg-gradient-to-r from-brand-start/5 to-transparent rounded-r-lg mb-4">
                        <p className="text-gray-700 italic text-sm">"{methodology.quote}"</p>
                    </blockquote>
                )}

                {/* Tags and CTA */}
                <div className="flex items-center justify-between gap-4 mt-4">
                    <div className="flex flex-wrap gap-2">
                        {methodology.tags.slice(0, 3).map(tag => (
                            <span
                                key={tag}
                                className="px-3 py-1 text-xs font-medium text-gray-600 bg-gray-100 rounded-full"
                            >
                                #{tag}
                            </span>
                        ))}
                    </div>
                    <Link
                        href={`/methodologies/${methodology.id}`}
                        className="flex-shrink-0 px-4 py-2 text-sm font-medium text-brand-mid hover:text-white hover:bg-gradient-to-r hover:from-brand-start hover:to-brand-mid rounded-lg border border-brand-mid/30 hover:border-transparent transition-all"
                    >
                        View Deep Dive →
                    </Link>
                </div>
            </div>
        </article>
    );
}
