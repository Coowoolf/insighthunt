'use client';

import { useState, useMemo, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Header } from '@/components/Header';
import { MethodologyCard } from '@/components/MethodologyCard';
import { CategoryFilter } from '@/components/CategoryFilter';
import { getAllMethodologies } from '@/data/insights';
import { Category } from '@/types';

function MethodologiesContent() {
    const searchParams = useSearchParams();
    const initialCategory = searchParams.get('category') as Category | null;

    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<Category | null>(initialCategory);

    const allMethodologies = getAllMethodologies();

    const filteredMethodologies = useMemo(() => {
        return allMethodologies.filter(m => {
            const q = searchQuery.toLowerCase();
            const matchesSearch = searchQuery === '' ||
                m.name.toLowerCase().includes(q) ||
                (m.name_zh && m.name_zh.includes(searchQuery)) ||
                (m.summary_zh && m.summary_zh.includes(searchQuery)) ||
                m.summary.toLowerCase().includes(q) ||
                m.guestName.toLowerCase().includes(q) ||
                (m.guestCompany && m.guestCompany.toLowerCase().includes(q)) ||
                (m.problemItSolves && m.problemItSolves.toLowerCase().includes(q)) ||
                m.principles.some(p => p.toLowerCase().includes(q)) ||
                m.tags.some(tag => tag.toLowerCase().includes(q));

            const matchesCategory = selectedCategory === null || m.category === selectedCategory;

            return matchesSearch && matchesCategory;
        });
    }, [allMethodologies, searchQuery, selectedCategory]);

    const sortedMethodologies = useMemo(() => {
        return [...filteredMethodologies].sort((a, b) => b.upvotes - a.upvotes);
    }, [filteredMethodologies]);

    return (
        <>
            <section className="text-center mb-8">
                <h1 className="text-4xl font-bold mb-4">
                    <span className="gradient-text">全部方法论</span>
                </h1>
                <p className="text-gray-600 max-w-2xl mx-auto">
                    浏览和搜索 689 个来自世界级 PM 的产品框架。
                </p>
            </section>

            <section className="mb-8">
                <div className="relative max-w-xl mx-auto">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xl">🔍</span>
                    <input
                        type="text"
                        placeholder="搜索方法论、嘉宾或话题..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="search-input"
                    />
                </div>
            </section>

            <section className="mb-8">
                <CategoryFilter
                    selectedCategory={selectedCategory}
                    onCategoryChange={setSelectedCategory}
                />
            </section>

            <div className="mb-6 flex items-center justify-between">
                <p className="text-gray-600">
                    显示 <span className="font-semibold text-brand-start">{sortedMethodologies.length}</span> 个方法论
                </p>
                <div className="text-sm text-gray-500">按热度排序</div>
            </div>

            <section className="space-y-6">
                {sortedMethodologies.map(methodology => (
                    <MethodologyCard key={methodology.id} methodology={methodology} />
                ))}

                {sortedMethodologies.length === 0 && (
                    <div className="clay-card text-center py-12">
                        <p className="text-2xl mb-2">🔍</p>
                        <p className="text-gray-600">未找到方法论。请尝试其他搜索词或分类。</p>
                    </div>
                )}
            </section>
        </>
    );
}

export default function MethodologiesPageCN() {
    return (
        <div className="min-h-screen">
            <div className="ambient-sphere ambient-sphere-1" />
            <div className="ambient-sphere ambient-sphere-2" />

            <Header />

            <main className="max-w-7xl mx-auto px-6 py-8">
                <Suspense fallback={<div className="text-center py-12">加载中...</div>}>
                    <MethodologiesContent />
                </Suspense>
            </main>
        </div>
    );
}
