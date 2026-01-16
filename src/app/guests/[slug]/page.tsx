import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getAllGuests, getGuestBySlug } from '@/data/insights';
import { Header } from '@/components/Header';
import { MethodologyCard } from '@/components/MethodologyCard';
import { CATEGORY_INFO } from '@/types';

// Generate static params for all guests
export async function generateStaticParams() {
    const guests = getAllGuests();
    return guests.map(guest => ({
        slug: guest.slug,
    }));
}

interface GuestPageProps {
    params: Promise<{ slug: string }>;
}

export default async function GuestPage({ params }: GuestPageProps) {
    const { slug } = await params;
    const guest = getGuestBySlug(slug);

    if (!guest) {
        notFound();
    }

    // Calculate category stats for this guest
    const categoryStats = guest.methodologies.reduce((acc, m) => {
        acc[m.category] = (acc[m.category] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    return (
        <div className="min-h-screen">
            {/* Ambient Decorations */}
            <div className="ambient-sphere ambient-sphere-1" />
            <div className="ambient-sphere ambient-sphere-2" />

            <Header />

            <main className="max-w-4xl mx-auto px-6 py-8">
                {/* Breadcrumb */}
                <nav className="mb-6">
                    <Link href="/guests" className="text-brand-start hover:underline text-sm">
                        ← All Guests
                    </Link>
                </nav>

                {/* Guest Header */}
                <section className="clay-card mb-8">
                    <div className="flex items-start gap-6">
                        <div className="w-20 h-20 rounded-full bg-gradient-brand flex items-center justify-center text-white font-bold text-3xl flex-shrink-0">
                            {guest.name.charAt(0)}
                        </div>
                        <div className="flex-1">
                            <h1 className="text-3xl font-bold text-gray-900 mb-1">{guest.name}</h1>
                            <p className="text-lg text-gray-600">{guest.title}</p>
                            <p className="text-brand-mid font-semibold">{guest.company}</p>

                            {/* Category badges */}
                            <div className="flex flex-wrap gap-2 mt-4">
                                {Object.entries(categoryStats).map(([cat, count]) => {
                                    const info = CATEGORY_INFO[cat as keyof typeof CATEGORY_INFO];
                                    return (
                                        <span key={cat} className="category-badge">
                                            {info.emoji} {info.label} ({count})
                                        </span>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </section>

                {/* Key Takeaways */}
                {guest.keyTakeaways.length > 0 && (
                    <section className="clay-card mb-8">
                        <h2 className="text-xl font-bold text-gray-900 mb-4 gradient-text">Key Takeaways</h2>
                        <ul className="space-y-3">
                            {guest.keyTakeaways.map((takeaway, index) => (
                                <li key={index} className="flex items-start gap-3 text-gray-700">
                                    <span className="text-brand-start font-bold">{index + 1}.</span>
                                    <span>{takeaway}</span>
                                </li>
                            ))}
                        </ul>
                    </section>
                )}

                {/* Methodologies */}
                <section>
                    <h2 className="text-xl font-bold text-gray-900 mb-4">
                        <span className="gradient-text">Methodologies</span>
                        <span className="text-gray-500 font-normal text-base ml-2">({guest.methodologies.length})</span>
                    </h2>
                    <div className="space-y-6">
                        {guest.methodologies.map(methodology => (
                            <MethodologyCard key={methodology.id} methodology={methodology} />
                        ))}
                    </div>
                </section>
            </main>
        </div>
    );
}
