import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Header } from '@/components/Header';
import { MethodologyCard } from '@/components/MethodologyCard';
import { TranscriptViewer } from '@/components/TranscriptViewer';
import { getGuestBySlug, getAllGuests, getAllMethodologies } from '@/data/insights';
import { getTranscriptByGuestName } from '@/data/transcripts';
import { CATEGORY_INFO } from '@/types';

// Generate static params for all episodes
export async function generateStaticParams() {
    const guests = getAllGuests();
    return guests.map((guest) => ({
        slug: guest.slug,
    }));
}

// Generate SEO metadata for episode pages
export async function generateMetadata({ params }: PageProps) {
    const { slug } = await params;
    const guest = getGuestBySlug(slug);

    if (!guest) {
        return {
            title: 'Episode Not Found | InsightHunt',
        };
    }

    const title = `${guest.name} - ${guest.title} | InsightHunt`;
    const description = guest.keyTakeaways?.[0] ||
        `${guest.name}, ${guest.title} at ${guest.company}. Insights and methodologies from Lenny's Podcast Episode #${guest.episodeNumber || '—'}.`;

    return {
        title,
        description,
        openGraph: {
            title,
            description,
            type: 'article',
            siteName: 'InsightHunt',
            locale: 'en_US',
        },
        twitter: {
            card: 'summary_large_image',
            title,
            description,
        },
        keywords: [
            guest.name,
            guest.company,
            guest.title,
            'podcast',
            'product management',
            'Lenny\'s Podcast'
        ].filter(Boolean),
    };
}

interface PageProps {
    params: Promise<{ slug: string }>;
}

export default async function EpisodeDetailPage({ params }: PageProps) {
    const { slug } = await params;
    const guest = getGuestBySlug(slug);

    if (!guest) {
        notFound();
    }

    const allMethodologies = getAllMethodologies();
    const guestMethodologies = allMethodologies.filter(m => m.guestId === guest.slug);
    const categories = [...new Set(guestMethodologies.map(m => m.category))];

    // Load transcript
    const transcript = getTranscriptByGuestName(guest.name);

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
                            <div className="flex items-center gap-3 mb-2">
                                <h1 className="text-3xl font-bold">{guest.name}</h1>
                                {guest.episodeNumber && (
                                    <span className="px-3 py-1 bg-brand-start/10 text-brand-start rounded-full text-sm font-medium">
                                        Episode #{guest.episodeNumber}
                                    </span>
                                )}
                            </div>
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

                {/* Full Transcript */}
                {transcript && (
                    <section className="mb-8">
                        <TranscriptViewer
                            enTranscript={transcript.en}
                            zhTranscript={transcript.zh}
                        />
                    </section>
                )}

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
