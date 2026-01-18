'use client';

import { Header } from '@/components/Header';
import { CategoryChart } from '@/components/CategoryChart';
import { getStats, getAllMethodologies, getAllGuests } from '@/data/insights';
import { CATEGORY_INFO, Category } from '@/types';

// Chinese labels for categories
const CATEGORY_LABELS_ZH: Record<Category, string> = {
    'product-strategy': '产品战略',
    'growth-metrics': '增长指标',
    'team-culture': '团队文化',
    'user-research': '用户研究',
    'execution': '执行交付',
    'career-leadership': '领导力',
};

export default function StatsPageCN() {
    const stats = getStats();
    const methodologies = getAllMethodologies();
    const guests = getAllGuests();

    const topGuests = guests
        .map(g => ({
            ...g,
            count: methodologies.filter(m => m.guestId === g.slug).length
        }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 10);

    return (
        <div className="min-h-screen">
            <div className="ambient-sphere ambient-sphere-1" />
            <div className="ambient-sphere ambient-sphere-2" />

            <Header />

            <main className="max-w-6xl mx-auto px-6 py-8">
                <section className="text-center mb-12">
                    <h1 className="text-5xl font-bold mb-4">
                        <span className="gradient-text">📊 数据概览</span>
                    </h1>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                        探索来自 {stats.totalGuests} 位世界级产品专家的 {stats.totalMethodologies} 个方法论分布。
                    </p>
                </section>

                <section className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
                    <div className="clay-card text-center">
                        <div className="text-4xl font-bold gradient-text">{stats.totalEpisodes}</div>
                        <div className="text-sm text-gray-600 mt-1">期节目</div>
                    </div>
                    <div className="clay-card text-center">
                        <div className="text-4xl font-bold gradient-text">{stats.totalGuests}</div>
                        <div className="text-sm text-gray-600 mt-1">位嘉宾</div>
                    </div>
                    <div className="clay-card text-center">
                        <div className="text-4xl font-bold gradient-text">{stats.totalMethodologies}</div>
                        <div className="text-sm text-gray-600 mt-1">个方法论</div>
                    </div>
                    <div className="clay-card text-center">
                        <div className="text-4xl font-bold gradient-text">6</div>
                        <div className="text-sm text-gray-600 mt-1">大分类</div>
                    </div>
                </section>

                <section className="clay-card mb-12">
                    <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                        <span>📈</span>
                        <span className="gradient-text">分类分布</span>
                    </h2>
                    <div className="grid md:grid-cols-2 gap-8">
                        <div>
                            <h3 className="text-lg font-semibold mb-4 text-center">饼图</h3>
                            <CategoryChart type="pie" showLegend={false} />
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold mb-4 text-center">柱状图</h3>
                            <CategoryChart type="bar" />
                        </div>
                    </div>
                </section>

                <section className="clay-card mb-12">
                    <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                        <span>🏆</span>
                        <span className="gradient-text">贡献榜</span>
                    </h2>
                    <div className="grid md:grid-cols-2 gap-4">
                        {topGuests.map((guest, index) => (
                            <div key={guest.id} className="flex items-center gap-4 p-4 bg-white/60 rounded-xl">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold ${index === 0 ? 'bg-yellow-500' :
                                        index === 1 ? 'bg-gray-400' :
                                            index === 2 ? 'bg-orange-600' : 'bg-gray-300'
                                    }`}>
                                    {index + 1}
                                </div>
                                <div className="flex-1">
                                    <div className="font-semibold">{guest.name}</div>
                                    <div className="text-sm text-gray-600">{guest.company}</div>
                                </div>
                                <div className="text-lg font-bold gradient-text">{guest.count}</div>
                            </div>
                        ))}
                    </div>
                </section>

                <section className="clay-card">
                    <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                        <span>📂</span>
                        <span className="gradient-text">分类详情</span>
                    </h2>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {(Object.entries(stats.categories) as [Category, number][])
                            .sort((a, b) => b[1] - a[1])
                            .map(([category, count]) => {
                                const info = CATEGORY_INFO[category];
                                const percentage = ((count / stats.totalMethodologies) * 100).toFixed(1);
                                return (
                                    <div key={category} className="p-4 bg-white/60 rounded-xl">
                                        <div className="flex items-center gap-2 mb-2">
                                            <span className="text-2xl">{info.emoji}</span>
                                            <span className="font-semibold">{CATEGORY_LABELS_ZH[category]}</span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-3xl font-bold gradient-text">{count}</span>
                                            <span className="text-sm text-gray-500">{percentage}%</span>
                                        </div>
                                        <div className="mt-2 h-2 bg-gray-200 rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-gradient-brand rounded-full"
                                                style={{ width: `${percentage}%` }}
                                            />
                                        </div>
                                    </div>
                                );
                            })}
                    </div>
                </section>
            </main>
        </div>
    );
}
