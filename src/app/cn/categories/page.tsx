'use client';

import Link from 'next/link';
import { Header } from '@/components/Header';
import { getStats, getAllMethodologies } from '@/data/insights';
import { CATEGORY_INFO, Category } from '@/types';

const CATEGORY_LABELS_ZH: Record<Category, string> = {
    'product-strategy': '产品战略',
    'growth-metrics': '增长指标',
    'team-culture': '团队文化',
    'user-research': '用户研究',
    'execution': '执行交付',
    'career-leadership': '领导力',
};

export default function CategoriesPageCN() {
    const stats = getStats();
    const methodologies = getAllMethodologies();
    const total = stats.totalMethodologies;

    const categories = (Object.entries(CATEGORY_INFO) as [Category, typeof CATEGORY_INFO[Category]][])
        .map(([key, info]) => ({
            key,
            ...info,
            labelZh: CATEGORY_LABELS_ZH[key],
            count: stats.categories[key] || 0,
            percentage: ((stats.categories[key] || 0) / total * 100).toFixed(1),
            topMethodologies: methodologies
                .filter(m => m.category === key)
                .sort((a, b) => b.upvotes - a.upvotes)
                .slice(0, 3),
        }))
        .sort((a, b) => b.count - a.count);

    return (
        <div className="min-h-screen">
            <div className="ambient-sphere ambient-sphere-1" />
            <div className="ambient-sphere ambient-sphere-2" />

            <Header />

            <main className="max-w-6xl mx-auto px-6 py-8">
                <section className="text-center mb-12">
                    <h1 className="text-5xl font-bold mb-4">
                        <span className="gradient-text">📂 分类总览</span>
                    </h1>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                        探索 {total} 个方法论，按 6 大核心分类整理。
                        每个分类包含来自世界级产品专家的可执行框架。
                    </p>
                </section>

                <section className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {categories.map((category) => (
                        <div
                            key={category.key}
                            className="clay-card hover:shadow-clay-hover transition-all group"
                        >
                            <div className="flex items-center gap-3 mb-4">
                                <span className="text-4xl">{category.emoji}</span>
                                <div>
                                    <h2 className="text-xl font-bold">{category.labelZh}</h2>
                                    <p className="text-sm text-gray-500">
                                        {category.count} 个方法论 ({category.percentage}%)
                                    </p>
                                </div>
                            </div>

                            <div className="h-2 bg-gray-200 rounded-full overflow-hidden mb-4">
                                <div
                                    className={`h-full bg-gradient-to-r ${category.gradient} rounded-full transition-all`}
                                    style={{ width: `${category.percentage}%` }}
                                />
                            </div>

                            <div className="space-y-2 mb-4">
                                <h3 className="text-sm font-semibold text-gray-500">热门方法论：</h3>
                                {category.topMethodologies.map((m) => (
                                    <Link
                                        key={m.id}
                                        href={`/cn/methodologies/${m.id}`}
                                        className="block p-2 bg-white/60 rounded-lg hover:bg-white transition-colors"
                                    >
                                        <div className="font-medium text-sm truncate">{m.name_zh || m.name}</div>
                                        <div className="text-xs text-gray-500 truncate">by {m.guestName}</div>
                                    </Link>
                                ))}
                            </div>

                            <Link
                                href={`/cn?category=${category.key}`}
                                className="inline-flex items-center gap-2 text-sm font-medium text-brand-start hover:underline"
                            >
                                查看全部 {category.count} 个 →
                            </Link>
                        </div>
                    ))}
                </section>

                <section className="mt-12 text-center">
                    <Link
                        href="/cn/stats"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-brand text-white font-semibold rounded-xl hover:shadow-clay transition-all"
                    >
                        📊 查看数据可视化
                    </Link>
                </section>
            </main>
        </div>
    );
}
