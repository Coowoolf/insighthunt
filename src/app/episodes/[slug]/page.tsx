'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Header } from '@/components/Header';
import { MethodologyCard } from '@/components/MethodologyCard';
import { getGuestBySlug, getAllMethodologies } from '@/data/insights';
import { CATEGORY_INFO } from '@/types';

export default function EpisodeDetailPage() {
    const params = useParams();
    const slug = params.slug as string;

    const guest = getGuestBySlug(slug);
    const allMethodologies = getAllMethodologies();

    if (!guest) {
        return (
            <div className="min-h-screen">
                <Header />
                <main className="max-w-4xl mx-auto px-6 py-16 text-center">
                    <h1 className="text-4xl font-bold mb-4">Episode Not Found</h1>
                    <p className="text-gray-600 mb-8">The episode you&apos;re looking for doesn&apos;t exist.</p>
                    <Link href="/episodes" className="text-brand-start hover:underline">
                        ← Back to all episodes
                    </Link>
                </main>
            </div>
        );
    }

    const guestMethodologies = allMethodologies.filter(m => m.guestId === guest.slug);
    const categories = [...new Set(guestMethodologies.map(m => m.category))];

    return (
        <div className="min-h-screen">
            <div className="ambient-sphere ambient-sphere-1" />
            <div className="ambient-sphere ambient-sphere-2" />

            <Header />

            <main className="max-w-4xl mx-auto px-6 py-8">
                {/* Breadcrumb */}
                <nav className="mb-6 text-sm text-gray-500">
                    <Link href="/" className="hover:text-brand-start">Home</Link>
                    <span className="mx-2">/</span>
                    <Link href="/episodes" className="hover:text-brand-start">Episodes</Link>
                    <span className="mx-2">/</span>
                    <span className="text-gray-900">{guest.name}</span>
                </nav>

                {/* Guest Header */}
                <section className="clay-card mb-8">
                    <div className="flex items-start gap-6">
                        <div className="w-20 h-20 rounded-2xl bg-gradient-brand flex items-center justify-center text-white text-3xl font-bold shrink-0">
                            {guest.name[0]}
                        </div>
                        <div className="flex-1">
                            <h1 className="text-3xl font-bold mb-2">{guest.name}</h1>
                            <p className="text-xl text-gray-600 mb-1">{guest.title}</p>
                            <p className="text-lg text-brand-start font-medium">{guest.company}</p>

                            {/* Category Tags */}
                            <div className="flex flex-wrap gap-2 mt-4">
                                {categories.map(cat => {
                                    const info = CATEGORY_INFO[cat];
                                    return (
                                        <span
                                            key={cat}
                                            className="inline-flex items-center gap-1 px-3 py-1 bg-white/60 rounded-full text-sm"
                                        >
                                            <span>{info.emoji}</span>
                                            <span className="text-gray-700">{info.label}</span>
                                        </span>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </section>

                {/* Key Takeaways */}
                {guest.keyTakeaways && guest.keyTakeaways.length > 0 && (
                    <section className="clay-card mb-8">
                        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                            <span>💡</span> Key Takeaways
                        </h2>
                        <ul className="space-y-3">
                            {guest.keyTakeaways.map((takeaway, i) => (
                                <li key={i} className="flex items-start gap-3">
                                    <span className="w-6 h-6 rounded-full bg-gradient-brand text-white text-xs flex items-center justify-center shrink-0 mt-0.5">
                                        {i + 1}
                                    </span>
                                    <span className="text-gray-700">{takeaway}</span>
                                </li>
                            ))}
                        </ul>
                    </section>
                )}

                {/* Methodologies from this episode */}
                <section>
                    <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                        <span>📚</span>
                        <span className="gradient-text">Methodologies ({guestMethodologies.length})</span>
                    </h2>

                    <div className="space-y-6">
                        {guestMethodologies.map(methodology => (
                            <MethodologyCard key={methodology.id} methodology={methodology} />
                        ))}
                    </div>

                    {guestMethodologies.length === 0 && (
                        <div className="clay-card text-center py-12">
                            <p className="text-gray-600">No methodologies extracted from this episode yet.</p>
                        </div>
                    )}
                </section>

                {/* Back to Episodes */}
                <div className="mt-12 text-center">
                    <Link
                        href="/episodes"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-brand text-white font-semibold rounded-xl hover:shadow-clay transition-all"
                    >
                        ← Browse All Episodes
                    </Link>
                </div>
            </main>
        </div>
    );
}
