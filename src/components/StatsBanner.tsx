'use client';

import { CATEGORY_INFO, Category } from '@/types';
import { getStats } from '@/data/insights';

interface StatsBannerProps {
    className?: string;
}

export function StatsBanner({ className = '' }: StatsBannerProps) {
    const stats = getStats();

    const categoryEntries = Object.entries(stats.categories) as [Category, number][];

    return (
        <section className={`clay-card bg-gradient-to-r from-brand-start/5 via-brand-mid/5 to-brand-end/5 ${className}`}>
            {/* Main Stats */}
            <div className="flex flex-wrap justify-center gap-8 mb-6">
                <div className="text-center">
                    <div className="text-4xl font-bold gradient-text">{stats.totalGuests}</div>
                    <div className="text-sm text-gray-600">Guests</div>
                </div>
                <div className="text-center">
                    <div className="text-4xl font-bold gradient-text">{stats.totalMethodologies}</div>
                    <div className="text-sm text-gray-600">Methodologies</div>
                </div>
                <div className="text-center">
                    <div className="text-4xl font-bold gradient-text">{stats.totalEpisodes}</div>
                    <div className="text-sm text-gray-600">Episodes (Full Archive)</div>
                </div>
            </div>

            {/* Category Breakdown */}
            <div className="border-t border-gray-200/50 pt-4">
                <h4 className="text-sm font-semibold text-gray-700 text-center mb-3">Categories</h4>
                <div className="flex flex-wrap justify-center gap-3">
                    {categoryEntries.map(([category, count]) => {
                        const info = CATEGORY_INFO[category];
                        return (
                            <div
                                key={category}
                                className="flex items-center gap-2 px-3 py-1.5 bg-white/60 rounded-full text-sm"
                            >
                                <span>{info.emoji}</span>
                                <span className="text-gray-700">{info.label}</span>
                                <span className="font-semibold text-brand-start">{count}</span>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
