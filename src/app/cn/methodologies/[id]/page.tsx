import { getAllMethodologies, getMethodologyById } from '@/data/insights';
import { CATEGORY_INFO, VisualizationType, Methodology } from '@/types';
import Link from 'next/link';
import { notFound } from 'next/navigation';

// Import all visualization components
import { PrincipleFlow } from '@/components/diagrams/PrincipleFlow';
import { Timeline } from '@/components/diagrams/Timeline';
import { Funnel } from '@/components/diagrams/Funnel';
import { Cycle } from '@/components/diagrams/Cycle';
import { FrameworkMatrix } from '@/components/diagrams/FrameworkMatrix';
import { WhenToUseCard } from '@/components/diagrams/ComparisonCard';
import { Spectrum } from '@/components/diagrams/Spectrum';
import { BeforeAfter } from '@/components/diagrams/BeforeAfter';
import { MindMap } from '@/components/diagrams/MindMap';
import { TreeDiagram } from '@/components/diagrams/TreeDiagram';
import { Pyramid } from '@/components/diagrams/Pyramid';
import { Onion } from '@/components/diagrams/Onion';
import { Equation } from '@/components/diagrams/Equation';
import { Checklist } from '@/components/diagrams/Checklist';
import { Scorecard } from '@/components/diagrams/Scorecard';
import { CaseStudy } from '@/components/diagrams/CaseStudy';

// Extended methodology type with Chinese fields
interface MethodologyWithZh extends Methodology {
    name_zh?: string;
    summary_zh?: string;
    principles_zh?: string[];
    quote_zh?: string;
    problemItSolves_zh?: string;
    whenToUse_zh?: string;
    commonMistakes_zh?: string;
    realWorldExample_zh?: string;
}

// Category labels in Chinese
const CATEGORY_INFO_ZH: Record<string, { label: string; emoji: string }> = {
    'product-strategy': { label: '产品战略', emoji: '🎯' },
    'growth-metrics': { label: '增长指标', emoji: '📈' },
    'team-culture': { label: '团队文化', emoji: '👥' },
    'user-research': { label: '用户研究', emoji: '🔍' },
    'execution': { label: '执行落地', emoji: '⚡' },
    'career-leadership': { label: '职业领导力', emoji: '🚀' },
};

// Generate static paths for all methodologies
export async function generateStaticParams() {
    const methodologies = getAllMethodologies();
    return methodologies.map((m) => ({
        id: m.id,
    }));
}

// Generate SEO metadata for Chinese version
export async function generateMetadata({ params }: Props) {
    const { id } = await params;
    const methodology = getMethodologyById(id) as MethodologyWithZh | undefined;

    if (!methodology) {
        return {
            title: '方法论未找到 | InsightHunt',
        };
    }

    const displayName = methodology.name_zh || methodology.name;
    const displaySummary = methodology.summary_zh || methodology.summary;
    const title = `${displayName} | InsightHunt 洞见猎手`;
    const description = (displaySummary?.slice(0, 160) ||
        `${displayName} - 来自 ${methodology.guestName} 的产品方法论。源自 Lenny's Podcast。`);

    return {
        title,
        description,
        openGraph: {
            title,
            description,
            type: 'article',
            siteName: 'InsightHunt',
            locale: 'zh_CN',
            authors: [methodology.guestName],
        },
        twitter: {
            card: 'summary_large_image',
            title,
            description,
        },
        keywords: [
            displayName,
            methodology.name,
            methodology.guestName,
            methodology.category,
            '产品管理',
            '方法论',
            '框架',
            ...methodology.tags
        ].filter(Boolean),
        alternates: {
            languages: {
                'en': `/methodologies/${id}`,
                'zh': `/cn/methodologies/${id}`,
            },
        },
    };
}

interface Props {
    params: Promise<{ id: string }>;
}

// Dynamic visualization renderer (same as EN version)
function DynamicVisualization({
    type,
    data,
    principles,
    methodologyName
}: {
    type?: VisualizationType;
    data?: Record<string, any>;
    principles: string[];
    methodologyName: string;
}) {
    const parsedPrinciples = principles.map(p => {
        const match = p.match(/^(?:Step\s*)?(\d+)[:.]\s*(.+)$/i);
        return match ? match[2] : p;
    });

    switch (type) {
        case 'StepFlow':
            return <PrincipleFlow principles={principles} title="流程框架" />;
        case 'Timeline':
            return (
                <Timeline
                    title="时间线"
                    events={data?.events || parsedPrinciples.map((p, i) => ({
                        phase: String(i + 1),
                        title: p.length > 40 ? p.substring(0, 37) + '...' : p,
                    }))}
                />
            );
        case 'Funnel':
            return (
                <Funnel
                    title="漏斗模型"
                    stages={data?.stages || parsedPrinciples.map(p => ({
                        label: p.length > 30 ? p.substring(0, 27) + '...' : p,
                    }))}
                />
            );
        case 'Cycle':
            return (
                <Cycle
                    title="循环模型"
                    centerLabel={data?.centerLabel || "核心"}
                    steps={data?.steps || parsedPrinciples.map(p => ({
                        label: p.length > 20 ? p.substring(0, 17) + '...' : p,
                    }))}
                />
            );
        case 'Matrix2x2':
            const colors = ['green', 'blue', 'yellow', 'red'] as const;
            if (data?.quadrants && Array.isArray(data.quadrants)) {
                const flatQuadrants = data.quadrants as any[];
                return (
                    <FrameworkMatrix
                        title="四象限矩阵"
                        xAxisLabel={data.xAxisLabel || "X轴"}
                        yAxisLabel={data.yAxisLabel || "Y轴"}
                        xLabels={["低", "高"]}
                        yLabels={["低", "高"]}
                        cells={[
                            [
                                { label: flatQuadrants[0]?.label || "象限1", color: colors[0] },
                                { label: flatQuadrants[1]?.label || "象限2", color: colors[1] }
                            ],
                            [
                                { label: flatQuadrants[2]?.label || "象限3", color: colors[2] },
                                { label: flatQuadrants[3]?.label || "象限4", color: colors[3] }
                            ]
                        ]}
                    />
                );
            }
            return (
                <FrameworkMatrix
                    title="四象限矩阵"
                    xAxisLabel="低 ← X轴 → 高"
                    yAxisLabel="低 ← Y轴 → 高"
                    xLabels={["低", "高"]}
                    yLabels={["低", "高"]}
                    cells={[
                        [
                            { label: parsedPrinciples[0]?.substring(0, 15) || "象限1", color: 'green' as const },
                            { label: parsedPrinciples[1]?.substring(0, 15) || "象限2", color: 'blue' as const }
                        ],
                        [
                            { label: parsedPrinciples[2]?.substring(0, 15) || "象限3", color: 'yellow' as const },
                            { label: parsedPrinciples[3]?.substring(0, 15) || "象限4", color: 'red' as const }
                        ]
                    ]}
                />
            );
        case 'Pyramid':
            return (
                <Pyramid
                    title="优先级金字塔"
                    levels={data?.levels || parsedPrinciples.slice(0, 4).map(p => ({
                        label: p.length > 30 ? p.substring(0, 27) + '...' : p
                    }))}
                />
            );
        case 'Onion':
            return (
                <Onion
                    title="层次模型"
                    core={data?.core || methodologyName.substring(0, 15)}
                    layers={data?.layers || parsedPrinciples.slice(0, 4).map(p => ({
                        label: p.length > 20 ? p.substring(0, 17) + '...' : p
                    }))}
                />
            );
        case 'Checklist':
            return (
                <Checklist
                    title="检查清单"
                    items={data?.items || parsedPrinciples.map(p => ({
                        text: p,
                        checked: false
                    }))}
                />
            );
        default:
            return (
                <MindMap
                    title="框架结构"
                    centerText={methodologyName.length > 25 ? methodologyName.substring(0, 22) + '...' : methodologyName}
                    centerEmoji="💡"
                    nodes={parsedPrinciples.slice(0, 5).map((text, i) => ({
                        text: text.length > 40 ? text.substring(0, 37) + '...' : text,
                        emoji: ['1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣'][i]
                    }))}
                />
            );
    }
}

export default async function ChineseMethodologyPage({ params }: Props) {
    const { id } = await params;
    const methodology = getMethodologyById(id) as MethodologyWithZh | undefined;

    if (!methodology) {
        notFound();
    }

    // Get Chinese content with fallback to English
    const displayName = methodology.name_zh || methodology.name;
    const displaySummary = methodology.summary_zh || methodology.summary;
    const displayPrinciples = methodology.principles_zh?.length ? methodology.principles_zh : methodology.principles;
    const displayQuote = methodology.quote_zh || methodology.quote;
    const displayProblem = methodology.problemItSolves_zh || methodology.problemItSolves;
    const displayWhenToUse = methodology.whenToUse_zh || methodology.whenToUse;
    const displayMistakes = methodology.commonMistakes_zh || methodology.commonMistakes;
    const displayExample = methodology.realWorldExample_zh || methodology.realWorldExample;

    const categoryInfo = CATEGORY_INFO[methodology.category];
    const categoryInfoZh = CATEGORY_INFO_ZH[methodology.category] || categoryInfo;
    const vizType = methodology.visualizationType;
    const vizTypeLabel = vizType || 'MindMap';

    return (
        <div className="min-h-screen bg-cream">
            {/* Header */}
            <header className="header-glass sticky top-0 z-50">
                <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
                    <Link href="/cn" className="flex items-center gap-3 group">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-start to-brand-end flex items-center justify-center shadow-lg">
                            <span className="text-white text-xl">💡</span>
                        </div>
                        <div>
                            <span className="text-xl font-bold gradient-text">InsightHunt</span>
                            <p className="text-xs text-gray-500">洞见猎手</p>
                        </div>
                    </Link>
                    <div className="flex items-center gap-4">
                        <Link
                            href="/cn/methodologies"
                            className="text-sm text-gray-600 hover:text-brand-mid transition-colors"
                        >
                            ← 返回全部方法论
                        </Link>
                        {/* Language Switcher */}
                        <div className="flex items-center gap-1 bg-white/80 backdrop-blur-sm rounded-full px-2 py-1 border border-gray-200 shadow-sm">
                            <Link href={`/methodologies/${methodology.id}`} className="px-2 py-0.5 rounded-full text-sm font-medium text-gray-600 hover:text-gray-900">
                                EN
                            </Link>
                            <span className="text-gray-300">|</span>
                            <span className="px-2 py-0.5 rounded-full text-sm font-medium bg-gradient-to-r from-purple-500 to-blue-500 text-white">
                                中
                            </span>
                        </div>
                    </div>
                </div>
            </header>

            <main className="max-w-5xl mx-auto px-6 py-12">
                {/* Hero Section */}
                <div className="mb-12 text-center">
                    <div className="flex items-center justify-center gap-3 mb-4">
                        <span className="category-badge">
                            {categoryInfoZh.emoji} {categoryInfoZh.label}
                        </span>
                        <span className="px-3 py-1 text-xs font-medium bg-purple-100 text-purple-700 rounded-full">
                            📊 {vizTypeLabel}
                        </span>
                    </div>

                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                        {displayName}
                    </h1>

                    <p className="text-lg text-gray-500 mb-6">
                        来自 <span className="font-semibold text-gray-700">{methodology.guestName}</span>
                        {methodology.guestTitle && <span> • {methodology.guestTitle}</span>}
                        {methodology.guestCompany && <span> @ {methodology.guestCompany}</span>}
                    </p>

                    {methodology.guestBackground && (
                        <p className="text-gray-600 max-w-2xl mx-auto leading-relaxed">
                            {methodology.guestBackground}
                        </p>
                    )}
                </div>

                {/* Episode Context Card */}
                {methodology.episodeSummary && (
                    <div className="mb-12 bg-gradient-to-r from-brand-start/5 to-brand-end/5 rounded-2xl p-6 border border-brand-start/10">
                        <h3 className="text-sm font-semibold text-gray-700 mb-2 uppercase tracking-wider flex items-center gap-2">
                            <span>🎙️</span> 播客背景
                        </h3>
                        <p className="text-gray-600 leading-relaxed">{methodology.episodeSummary}</p>
                    </div>
                )}

                {/* Problem It Solves */}
                {displayProblem && (
                    <section className="mb-12">
                        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-amber-200 p-8">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-amber-200 to-orange-200 rounded-full blur-3xl opacity-50" />
                            <div className="relative">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center shadow-lg">
                                        <span className="text-2xl text-white">🎯</span>
                                    </div>
                                    <h2 className="text-2xl font-bold text-gray-900">解决的问题</h2>
                                </div>
                                <p className="text-gray-700 text-lg leading-relaxed">
                                    {displayProblem}
                                </p>
                            </div>
                        </div>
                    </section>
                )}

                {/* Overview Summary */}
                <section className="mb-12">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-lg">
                            <span className="text-2xl text-white">📖</span>
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900">框架概述</h2>
                    </div>
                    <p className="text-gray-700 text-lg leading-relaxed bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
                        {displaySummary}
                    </p>
                </section>

                {/* DYNAMIC VISUALIZATION */}
                <section className="mb-12 bg-white rounded-2xl p-8 border border-gray-100 shadow-lg">
                    <DynamicVisualization
                        type={methodology.visualizationType}
                        data={methodology.visualizationData}
                        principles={displayPrinciples}
                        methodologyName={displayName}
                    />
                </section>

                {/* When to Use & Common Mistakes */}
                {(displayWhenToUse || displayMistakes) && (
                    <section className="mb-12">
                        <div className="grid md:grid-cols-2 gap-6">
                            {displayWhenToUse && (
                                <div className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-2xl p-6 border-2 border-emerald-200">
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-green-500 flex items-center justify-center">
                                            <span className="text-xl text-white">✅</span>
                                        </div>
                                        <h3 className="text-xl font-bold text-gray-900">适用场景</h3>
                                    </div>
                                    <p className="text-gray-700 leading-relaxed">{displayWhenToUse}</p>
                                </div>
                            )}
                            {displayMistakes && (
                                <div className="bg-gradient-to-br from-rose-50 to-red-50 rounded-2xl p-6 border-2 border-rose-200">
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-rose-500 to-red-500 flex items-center justify-center">
                                            <span className="text-xl text-white">⚠️</span>
                                        </div>
                                        <h3 className="text-xl font-bold text-gray-900">常见错误</h3>
                                    </div>
                                    <p className="text-gray-700 leading-relaxed">{displayMistakes}</p>
                                </div>
                            )}
                        </div>
                    </section>
                )}

                {/* Real World Example */}
                {displayExample && (
                    <section className="mb-12">
                        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-cyan-50 to-teal-50 border-2 border-cyan-200 p-8">
                            <div className="absolute bottom-0 left-0 w-40 h-40 bg-gradient-to-br from-cyan-200 to-teal-200 rounded-full blur-3xl opacity-50" />
                            <div className="relative">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-teal-500 flex items-center justify-center shadow-lg">
                                        <span className="text-2xl text-white">💼</span>
                                    </div>
                                    <h2 className="text-2xl font-bold text-gray-900">实际案例</h2>
                                </div>
                                <p className="text-gray-700 text-lg leading-relaxed">
                                    {displayExample}
                                </p>
                            </div>
                        </div>
                    </section>
                )}

                {/* Quote */}
                {displayQuote && (
                    <section className="mb-12">
                        <div className="relative bg-gradient-to-br from-violet-100 via-purple-50 to-pink-100 rounded-2xl p-10 border border-purple-200 shadow-xl overflow-hidden">
                            <div className="absolute top-4 left-6 text-8xl text-purple-200 font-serif">"</div>
                            <div className="absolute bottom-4 right-6 text-8xl text-purple-200 font-serif rotate-180">"</div>
                            <div className="relative z-10">
                                <p className="text-2xl text-gray-800 italic leading-relaxed text-center px-8 mb-6">
                                    {displayQuote}
                                </p>
                                <p className="text-center text-gray-600 font-semibold">
                                    — {methodology.guestName}
                                </p>
                            </div>
                        </div>
                    </section>
                )}

                {/* Tags */}
                <section className="mb-10">
                    <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">关键词</h3>
                    <div className="flex flex-wrap gap-2">
                        {methodology.tags.map(tag => (
                            <span
                                key={tag}
                                className="px-4 py-2 text-sm font-medium text-gray-600 bg-white rounded-full border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
                            >
                                #{tag}
                            </span>
                        ))}
                    </div>
                </section>

                {/* Navigation */}
                <div className="border-t border-gray-200 pt-8 flex justify-between items-center">
                    <Link
                        href="/cn/methodologies"
                        className="text-brand-mid hover:text-brand-start transition-colors font-medium"
                    >
                        ← 返回全部方法论
                    </Link>
                    <Link
                        href={`/cn/guests/${methodology.guestId}`}
                        className="px-6 py-3 bg-gradient-to-r from-brand-start to-brand-mid text-white rounded-xl font-medium hover:shadow-lg transition-all"
                    >
                        查看 {methodology.guestName} 的主页 →
                    </Link>
                </div>
            </main>
        </div>
    );
}
