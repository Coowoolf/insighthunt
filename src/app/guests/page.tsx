import Link from 'next/link';
import { getAllGuests } from '@/data/insights';
import { Header } from '@/components/Header';

export default function GuestsPage() {
    const guests = getAllGuests();

    return (
        <div className="min-h-screen">
            {/* Ambient Decorations */}
            <div className="ambient-sphere ambient-sphere-1" />
            <div className="ambient-sphere ambient-sphere-2" />

            <Header />

            <main className="max-w-7xl mx-auto px-6 py-8">
                <section className="text-center mb-12">
                    <h1 className="text-4xl font-bold mb-4">
                        <span className="gradient-text">Meet the Guests</span>
                    </h1>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        {guests.length} product leaders sharing their methodologies from Lenny&apos;s Podcast.
                    </p>
                </section>

                <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {guests.map(guest => (
                        <Link
                            key={guest.id}
                            href={`/guests/${guest.slug}`}
                            className="clay-card hover:shadow-clay-lg transition-all duration-300 group"
                        >
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 rounded-full bg-gradient-brand flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                                    {guest.name.charAt(0)}
                                </div>
                                <div className="min-w-0">
                                    <h3 className="font-semibold text-gray-900 group-hover:text-brand-start transition-colors truncate">
                                        {guest.name}
                                    </h3>
                                    <p className="text-sm text-gray-500 truncate">{guest.title}</p>
                                    <p className="text-sm text-brand-mid font-medium">{guest.company}</p>
                                </div>
                            </div>
                            <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
                                <span className="text-sm text-gray-600">
                                    {guest.methodologies.length} methodologies
                                </span>
                                <span className="text-brand-start text-sm font-medium group-hover:translate-x-1 transition-transform">
                                    View →
                                </span>
                            </div>
                        </Link>
                    ))}
                </section>
            </main>
        </div>
    );
}
