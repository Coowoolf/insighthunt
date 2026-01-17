'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { getAllMethodologies } from '@/data/insights';
import { Category, CATEGORY_INFO, Methodology } from '@/types';

// Extended methodology type with Chinese fields
interface MethodologyWithZh extends Methodology {
    name_zh?: string;
    summary_zh?: string;
    principles_zh?: string[];
    quote_zh?: string;
}

export default function ChineseHome() {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);

    const allMethodologies = getAllMethodologies() as MethodologyWithZh[];

    // Only show methodologies with Chinese translations
    const translatedMethodologies = useMemo(() => {
        return allMethodologies.filter(m => m.summary_zh);
    }, [allMethodologies]);

    const filteredMethodologies = useMemo(() => {
        return translatedMethodologies.filter(m => {
            const matchesSearch = searchQuery === '' ||
                (m.name_zh || '').includes(searchQuery) ||
                (m.summary_zh || '').includes(searchQuery) ||
                m.guestName.toLowerCase().includes(searchQuery.toLowerCase());

            const matchesCategory = selectedCategory === null || m.category === selectedCategory;

            return matchesSearch && matchesCategory;
        });
    }, [translatedMethodologies, searchQuery, selectedCategory]);

    const sortedMethodologies = useMemo(() => {
        return [...filteredMethodologies].sort((a, b) => b.upvotes - a.upvotes);
    }, [filteredMethodologies]);

    // Get unique guest count from translated methodologies
    const uniqueGuests = useMemo(() => {
        const guests = new Set(translatedMethodologies.map(m => m.guestName));
        return guests.size;
    }, [translatedMethodologies]);

    return (
        <div className="min-h-screen">
            {/* Ambient Decorations */}
            <div className="ambient-sphere ambient-sphere-1" />
            <div className="ambient-sphere ambient-sphere-2" />
            <div className="ambient-sphere ambient-sphere-3" />

            {/* Header */}
            <header className="glass-header sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-6 py-4">
                    <div className="flex items-center justify-between">
                        <Link href="/cn" className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-gradient-brand flex items-center justify-center text-white text-xl">
                                💡
                            </div>
                            <div>
                                <h1 className="text-xl font-bold gradient-text">InsightHunt</h1>
                                <p className="text-xs text-gray-500">洞见猎手</p>
                            </div>
                        </Link>

                        <nav className="hidden md:flex items-center gap-6">
                            <Link href="/cn" className="text-brand-start font-medium">
                                方法论
                            </Link>
                            <Link href="/cn/guests" className="text-gray-600 hover:text-brand-start transition-colors font-medium">
                                嘉宾
                            </Link>
                        </nav>

                        <div className="flex items-center gap-3">
                            <div className="hidden sm:flex items-center gap-3 text-sm">
                                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-brand-start/10 to-brand-mid/10">
                                    <span className="text-brand-start">🎙️</span>
                                    <span className="font-semibold text-gray-700">{uniqueGuests} 位嘉宾</span>
                                </div>
                                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-primary-orange/10 to-primary-gold/10">
                                    <span className="text-primary-orange">💡</span>
                                    <span className="font-semibold text-gray-700">{translatedMethodologies.length} 个洞见</span>
                                </div>
                            </div>
                            {/* Language Switcher */}
                            <div className="flex items-center gap-1 bg-white/80 backdrop-blur-sm rounded-full px-2 py-1 border border-gray-200 shadow-sm">
                                <Link href="/" className="px-2 py-0.5 rounded-full text-sm font-medium text-gray-600 hover:text-gray-900">
                                    EN
                                </Link>
                                <span className="text-gray-300">|</span>
                                <span className="px-2 py-0.5 rounded-full text-sm font-medium bg-gradient-to-r from-purple-500 to-blue-500 text-white">
                                    中
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-6 py-8">
                {/* Hero Section */}
                <section className="text-center mb-12">
                    <h1 className="text-5xl font-bold mb-4">
                        <span className="gradient-text">猎取顶级产品洞见</span>
                    </h1>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
                        从 Lenny's Podcast 中提取的 {translatedMethodologies.length}+ 个产品方法论，
                        来自全球顶尖产品经理的智慧结晶。
                    </p>

                    {/* Search Bar */}
                    <div className="relative max-w-xl mx-auto">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xl">🔍</span>
                        <input
                            type="text"
                            placeholder="搜索方法论、嘉宾或主题..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="search-input"
                        />
                    </div>
                </section>

                {/* Stats Banner */}
                <section className="mb-8">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                        <div className="clay-card text-center py-4">
                            <div className="text-3xl font-bold gradient-text">{uniqueGuests}</div>
                            <div className="text-sm text-gray-500">位嘉宾</div>
                        </div>
                        <div className="clay-card text-center py-4">
                            <div className="text-3xl font-bold gradient-text">{translatedMethodologies.length}</div>
                            <div className="text-sm text-gray-500">个方法论</div>
                        </div>
                        <div className="clay-card text-center py-4">
                            <div className="text-3xl font-bold gradient-text">297</div>
                            <div className="text-sm text-gray-500">期播客</div>
                        </div>
                        <div className="clay-card text-center py-4 bg-gradient-to-br from-brand-start/5 to-brand-end/5">
                            <div className="text-3xl font-bold gradient-text">🔄</div>
                            <div className="text-sm text-gray-500">持续更新中</div>
                        </div>
                    </div>
                </section>

                {/* Results Count */}
                <div className="mb-6 flex items-center justify-between">
                    <p className="text-gray-600">
                        显示 <span className="font-semibold text-brand-start">{sortedMethodologies.length}</span> 个方法论
                        {searchQuery && <span> 匹配 "{searchQuery}"</span>}
                    </p>
                    <div className="text-sm text-gray-500">
                        按热度排序
                    </div>
                </div>

                {/* Methodology Grid */}
                <section className="space-y-6">
                    {sortedMethodologies.map(methodology => (
                        <ChineseMethodologyCard key={methodology.id} methodology={methodology} />
                    ))}

                    {sortedMethodologies.length === 0 && (
                        <div className="clay-card text-center py-12">
                            <p className="text-2xl mb-2">🔍</p>
                            <p className="text-gray-600">未找到匹配的方法论，请尝试其他搜索词。</p>
                        </div>
                    )}
                </section>

                {/* Footer CTA */}
                <section className="mt-16 text-center">
                    <div className="clay-card bg-gradient-to-r from-brand-start/5 via-brand-mid/5 to-brand-end/5">
                        <h3 className="text-2xl font-bold mb-2 gradient-text">更多洞见即将上线</h3>
                        <p className="text-gray-600 mb-4">
                            我们正在从 Lenny's Podcast 的 297 期节目中提取更多方法论，敬请期待！
                        </p>
                        <div className="flex items-center justify-center gap-4">
                            <Link
                                href="/"
                                className="inline-block px-6 py-3 bg-white text-gray-700 font-semibold rounded-xl border border-gray-200 hover:shadow-clay transition-all"
                            >
                                查看英文版
                            </Link>
                        </div>
                    </div>
                </section>
            </main>

            {/* Footer */}
            <footer className="mt-16 py-8 border-t border-gray-200">
                <div className="max-w-7xl mx-auto px-6 text-center text-gray-500 text-sm">
                    <p className="mb-2">
                        <span className="gradient-text font-semibold">InsightHunt</span> — Hunt 系列产品
                    </p>
                    <p>
                        为产品经理社区用 💜 打造。基于 <a href="https://www.lennyspodcast.com/" className="text-brand-start hover:underline">Lenny's Podcast</a>。
                    </p>
                </div>
            </footer>
        </div>
    );
}

// Chinese Methodology Card Component
function ChineseMethodologyCard({ methodology }: { methodology: MethodologyWithZh }) {
    const [upvotes, setUpvotes] = useState(methodology.upvotes);
    const [hasUpvoted, setHasUpvoted] = useState(false);

    const categoryInfo = CATEGORY_INFO[methodology.category];

    const displayName = methodology.name_zh || methodology.name;
    const displaySummary = methodology.summary_zh || methodology.summary;
    const displayPrinciples = methodology.principles_zh?.length ? methodology.principles_zh : methodology.principles;
    const displayQuote = methodology.quote_zh || methodology.quote;

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
                            href={`/cn/methodologies/${methodology.id}`}
                            className="text-xl font-semibold text-gray-900 mb-1 hover:text-brand-mid transition-colors block"
                        >
                            {displayName}
                        </Link>
                        <p className="text-sm text-gray-500">
                            来自 <span className="font-medium text-gray-700">{methodology.guestName}</span>
                        </p>
                    </div>
                    <span className="category-badge flex-shrink-0">
                        {categoryInfo.emoji} {categoryInfo.label}
                    </span>
                </div>

                {/* Summary */}
                <p className="text-gray-600 mb-4 leading-relaxed">
                    {displaySummary}
                </p>

                {/* Principles Preview */}
                <div className="mb-4">
                    <h4 className="text-sm font-semibold text-gray-700 mb-2">核心原则</h4>
                    <ul className="space-y-1">
                        {displayPrinciples.slice(0, 3).map((principle, index) => (
                            <li key={index} className="flex items-start gap-2 text-sm text-gray-600">
                                <span className="text-brand-start font-semibold">{index + 1}.</span>
                                <span>{principle}</span>
                            </li>
                        ))}
                        {displayPrinciples.length > 3 && (
                            <li className="text-sm text-brand-mid font-medium">
                                +{displayPrinciples.length - 3} 更多...
                            </li>
                        )}
                    </ul>
                </div>

                {/* Quote */}
                {displayQuote && (
                    <blockquote className="border-l-4 border-brand-mid pl-4 py-2 bg-gradient-to-r from-brand-start/5 to-transparent rounded-r-lg mb-4">
                        <p className="text-gray-700 italic text-sm">"{displayQuote}"</p>
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
                        href={`/cn/methodologies/${methodology.id}`}
                        className="flex-shrink-0 px-4 py-2 text-sm font-medium text-brand-mid hover:text-white hover:bg-gradient-to-r hover:from-brand-start hover:to-brand-mid rounded-lg border border-brand-mid/30 hover:border-transparent transition-all"
                    >
                        深入了解 →
                    </Link>
                </div>
            </div>
        </article>
    );
}
