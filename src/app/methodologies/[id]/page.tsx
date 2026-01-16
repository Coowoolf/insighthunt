import { getAllMethodologies, getMethodologyById } from '@/data/insights';
import { CATEGORY_INFO } from '@/types';
import Link from 'next/link';
import { notFound } from 'next/navigation';

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

            <main className="max-w-4xl mx-auto px-6 py-12">
                {/* Hero Section */}
                <div className="mb-12">
                    <div className="flex items-center gap-3 mb-4">
                        <span className="category-badge">
                            {categoryInfo.emoji} {categoryInfo.label}
                        </span>
                        <span className="text-sm text-gray-500">
                            by <span className="font-medium text-gray-700">{methodology.guestName}</span>
                        </span>
                    </div>

                    <h1 className="text-4xl font-bold text-gray-900 mb-4">
                        {methodology.name}
                    </h1>

                    {methodology.guestBackground && (
                        <p className="text-gray-600 text-lg leading-relaxed mb-6">
                            <span className="font-semibold">{methodology.guestName}</span>
                            {methodology.guestTitle && `, ${methodology.guestTitle}`}
                            {methodology.guestCompany && ` at ${methodology.guestCompany}`}
                            {'. '}{methodology.guestBackground}
                        </p>
                    )}

                    {methodology.episodeSummary && (
                        <div className="bg-gradient-to-r from-brand-start/5 to-brand-end/5 rounded-xl p-6 border border-brand-start/10">
                            <h3 className="text-sm font-semibold text-gray-700 mb-2 uppercase tracking-wider">Episode Context</h3>
                            <p className="text-gray-600 leading-relaxed">{methodology.episodeSummary}</p>
                        </div>
                    )}
                </div>

                {/* Problem It Solves */}
                {methodology.problemItSolves && (
                    <section className="mb-10">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center">
                                <span className="text-xl">🎯</span>
                            </div>
                            <h2 className="text-2xl font-bold text-gray-900">Problem It Solves</h2>
                        </div>
                        <p className="text-gray-700 text-lg leading-relaxed pl-13">
                            {methodology.problemItSolves}
                        </p>
                    </section>
                )}

                {/* Summary */}
                <section className="mb-10">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                            <span className="text-xl">📖</span>
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900">Overview</h2>
                    </div>
                    <p className="text-gray-700 text-lg leading-relaxed pl-13">
                        {methodology.summary}
                    </p>
                </section>

                {/* Core Principles */}
                <section className="mb-10">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
                            <span className="text-xl">⚡</span>
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900">Core Principles</h2>
                    </div>
                    <div className="space-y-4">
                        {methodology.principles.map((principle, index) => (
                            <div
                                key={index}
                                className="flex gap-4 p-4 bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
                            >
                                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-brand-start to-brand-mid flex items-center justify-center text-white font-bold text-sm">
                                    {index + 1}
                                </div>
                                <p className="text-gray-700 leading-relaxed">{principle}</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* When to Use & Common Mistakes */}
                {(methodology.whenToUse || methodology.commonMistakes) && (
                    <div className="grid md:grid-cols-2 gap-6 mb-10">
                        {methodology.whenToUse && (
                            <section className="bg-emerald-50 rounded-xl p-6 border border-emerald-100">
                                <div className="flex items-center gap-2 mb-3">
                                    <span className="text-xl">✅</span>
                                    <h3 className="text-lg font-bold text-emerald-900">When to Use</h3>
                                </div>
                                <p className="text-emerald-800 leading-relaxed">
                                    {methodology.whenToUse}
                                </p>
                            </section>
                        )}

                        {methodology.commonMistakes && (
                            <section className="bg-red-50 rounded-xl p-6 border border-red-100">
                                <div className="flex items-center gap-2 mb-3">
                                    <span className="text-xl">⚠️</span>
                                    <h3 className="text-lg font-bold text-red-900">Common Mistakes</h3>
                                </div>
                                <p className="text-red-800 leading-relaxed">
                                    {methodology.commonMistakes}
                                </p>
                            </section>
                        )}
                    </div>
                )}

                {/* Real World Example */}
                {methodology.realWorldExample && (
                    <section className="mb-10">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 rounded-lg bg-cyan-100 flex items-center justify-center">
                                <span className="text-xl">💼</span>
                            </div>
                            <h2 className="text-2xl font-bold text-gray-900">Real World Example</h2>
                        </div>
                        <div className="bg-cyan-50 rounded-xl p-6 border border-cyan-100">
                            <p className="text-cyan-900 leading-relaxed text-lg">
                                {methodology.realWorldExample}
                            </p>
                        </div>
                    </section>
                )}

                {/* Quote */}
                {methodology.quote && (
                    <section className="mb-10">
                        <blockquote className="relative bg-gradient-to-br from-brand-start/10 to-brand-end/10 rounded-2xl p-8 border-l-4 border-brand-mid">
                            <div className="absolute top-4 left-4 text-6xl text-brand-start/20 font-serif">"</div>
                            <p className="text-xl text-gray-800 italic leading-relaxed pl-8 pr-4">
                                {methodology.quote}
                            </p>
                            <footer className="mt-4 pl-8 text-gray-600 font-medium">
                                — {methodology.guestName}
                            </footer>
                        </blockquote>
                    </section>
                )}

                {/* Tags */}
                <section className="mb-10">
                    <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">Keywords</h3>
                    <div className="flex flex-wrap gap-2">
                        {methodology.tags.map(tag => (
                            <span
                                key={tag}
                                className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 rounded-full border border-gray-200"
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
