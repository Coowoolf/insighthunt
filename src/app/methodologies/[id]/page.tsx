import { getAllMethodologies, getMethodologyById } from '@/data/insights';
import { CATEGORY_INFO } from '@/types';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { PrincipleFlow } from '@/components/diagrams/PrincipleFlow';
import { MindMap } from '@/components/diagrams/MindMap';
import { WhenToUseCard } from '@/components/diagrams/ComparisonCard';

// Generate static paths for all methodologies
export async function generateStaticParams() {
    const methodologies = getAllMethodologies();
    return methodologies.map((m) => ({
        id: m.id,
    }));
}

interface Props {
    params: Promise<{ id: string }>;
}

export default async function MethodologyPage({ params }: Props) {
    const { id } = await params;
    const methodology = getMethodologyById(id);

    if (!methodology) {
        notFound();
    }

    const categoryInfo = CATEGORY_INFO[methodology.category];

    // Parse principles for visualization
    const principleTexts = methodology.principles.map(p => {
        const match = p.match(/^(?:Step\s*)?(\d+)[:.]\s*(.+)$/i);
        return match ? match[2] : p;
    });

    return (
        <div className="min-h-screen bg-cream">
            {/* Header */}
            <header className="header-glass sticky top-0 z-50">
                <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-3 group">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-start to-brand-end flex items-center justify-center shadow-lg">
                            <span className="text-white text-xl">💡</span>
                        </div>
                        <span className="text-xl font-bold gradient-text">InsightHunt</span>
                    </Link>
                    <Link
                        href="/"
                        className="text-sm text-gray-600 hover:text-brand-mid transition-colors"
                    >
                        ← Back to All Methodologies
                    </Link>
                </div>
            </header>

            <main className="max-w-5xl mx-auto px-6 py-12">
                {/* Hero Section */}
                <div className="mb-12 text-center">
                    <div className="flex items-center justify-center gap-3 mb-4">
                        <span className="category-badge">
                            {categoryInfo.emoji} {categoryInfo.label}
                        </span>
                    </div>

                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                        {methodology.name}
                    </h1>

                    <p className="text-lg text-gray-500 mb-6">
                        by <span className="font-semibold text-gray-700">{methodology.guestName}</span>
                        {methodology.guestTitle && <span> • {methodology.guestTitle}</span>}
                        {methodology.guestCompany && <span> at {methodology.guestCompany}</span>}
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
                            <span>🎙️</span> Episode Context
                        </h3>
                        <p className="text-gray-600 leading-relaxed">{methodology.episodeSummary}</p>
                    </div>
                )}

                {/* Problem It Solves - Visual Card */}
                {methodology.problemItSolves && (
                    <section className="mb-12">
                        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-amber-200 p-8">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-amber-200 to-orange-200 rounded-full blur-3xl opacity-50" />
                            <div className="relative">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center shadow-lg">
                                        <span className="text-2xl text-white">🎯</span>
                                    </div>
                                    <h2 className="text-2xl font-bold text-gray-900">Problem It Solves</h2>
                                </div>
                                <p className="text-gray-700 text-lg leading-relaxed">
                                    {methodology.problemItSolves}
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
                        <h2 className="text-2xl font-bold text-gray-900">Framework Overview</h2>
                    </div>
                    <p className="text-gray-700 text-lg leading-relaxed bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
                        {methodology.summary}
                    </p>
                </section>

                {/* VISUAL: Mind Map for Core Framework */}
                <section className="mb-12 bg-white rounded-2xl p-8 border border-gray-100 shadow-lg">
                    <MindMap
                        title="Framework Structure"
                        centerText={methodology.name.length > 30 ? methodology.name.substring(0, 27) + '...' : methodology.name}
                        centerEmoji={categoryInfo.emoji}
                        nodes={principleTexts.slice(0, 5).map((text, i) => ({
                            text: text.length > 50 ? text.substring(0, 47) + '...' : text,
                            emoji: ['1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣'][i]
                        }))}
                    />
                </section>

                {/* VISUAL: Principle Flow (Step by Step) */}
                <section className="mb-12 bg-white rounded-2xl p-8 border border-gray-100 shadow-lg">
                    <PrincipleFlow
                        principles={methodology.principles}
                        title="Step-by-Step Framework"
                    />
                </section>

                {/* VISUAL: When to Use & Common Mistakes */}
                {(methodology.whenToUse || methodology.commonMistakes) && (
                    <section className="mb-12">
                        <WhenToUseCard
                            whenToUse={methodology.whenToUse}
                            commonMistakes={methodology.commonMistakes}
                        />
                    </section>
                )}

                {/* Real World Example - Visual Card */}
                {methodology.realWorldExample && (
                    <section className="mb-12">
                        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-cyan-50 to-teal-50 border-2 border-cyan-200 p-8">
                            <div className="absolute bottom-0 left-0 w-40 h-40 bg-gradient-to-br from-cyan-200 to-teal-200 rounded-full blur-3xl opacity-50" />
                            <div className="relative">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-teal-500 flex items-center justify-center shadow-lg">
                                        <span className="text-2xl text-white">💼</span>
                                    </div>
                                    <h2 className="text-2xl font-bold text-gray-900">Real World Example</h2>
                                </div>
                                <p className="text-gray-700 text-lg leading-relaxed">
                                    {methodology.realWorldExample}
                                </p>
                            </div>
                        </div>
                    </section>
                )}

                {/* Quote - Large Visual */}
                {methodology.quote && (
                    <section className="mb-12">
                        <div className="relative bg-gradient-to-br from-violet-100 via-purple-50 to-pink-100 rounded-2xl p-10 border border-purple-200 shadow-xl overflow-hidden">
                            <div className="absolute top-4 left-6 text-8xl text-purple-200 font-serif">"</div>
                            <div className="absolute bottom-4 right-6 text-8xl text-purple-200 font-serif rotate-180">"</div>
                            <div className="relative z-10">
                                <p className="text-2xl text-gray-800 italic leading-relaxed text-center px-8 mb-6">
                                    {methodology.quote}
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
                    <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">Keywords</h3>
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
                        href="/"
                        className="text-brand-mid hover:text-brand-start transition-colors font-medium"
                    >
                        ← Back to All Methodologies
                    </Link>
                    <Link
                        href={`/guests/${methodology.guestId}`}
                        className="px-6 py-3 bg-gradient-to-r from-brand-start to-brand-mid text-white rounded-xl font-medium hover:shadow-lg transition-all"
                    >
                        View {methodology.guestName}'s Profile →
                    </Link>
                </div>
            </main>
        </div>
    );
}
