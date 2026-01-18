'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { Header } from '@/components/Header';
import { getAllGuests, getAllMethodologies } from '@/data/insights';

export default function EpisodesPage() {
    const [searchQuery, setSearchQuery] = useState('');
    const guests = getAllGuests();
    const methodologies = getAllMethodologies();

    // Create episode data with methodology counts
    const episodes = useMemo(() => {
        return guests.map(guest => {
            const guestMethodologies = methodologies.filter(m => m.guestId === guest.slug);
            return {
                ...guest,
                methodologyCount: guestMethodologies.length,
                categories: [...new Set(guestMethodologies.map(m => m.category))],
            };
        }).sort((a, b) => a.name.localeCompare(b.name));
    }, [guests, methodologies]);

    // Filter by search
    const filteredEpisodes = useMemo(() => {
        if (!searchQuery) return episodes;
        const q = searchQuery.toLowerCase();
        return episodes.filter(ep =>
            ep.name.toLowerCase().includes(q) ||
            ep.company.toLowerCase().includes(q) ||
            ep.title.toLowerCase().includes(q)
        );
    }, [episodes, searchQuery]);

    // Group by first letter
    const groupedEpisodes = useMemo(() => {
        const groups: Record<string, typeof episodes> = {};
        filteredEpisodes.forEach(ep => {
            const letter = ep.name[0].toUpperCase();
            if (!groups[letter]) groups[letter] = [];
            groups[letter].push(ep);
        });
        return groups;
    }, [filteredEpisodes]);

    return (
        <div className="min-h-screen">
            <div className="ambient-sphere ambient-sphere-1" />
            <div className="ambient-sphere ambient-sphere-2" />

            <Header />

            <main className="max-w-7xl mx-auto px-6 py-8">
                {/* Hero */}
                <section className="text-center mb-12">
                    <h1 className="text-5xl font-bold mb-4">
                        <span className="gradient-text">🎙️ All Episodes</span>
                    </h1>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
                        Browse all {episodes.length} podcast episodes from Lenny&apos;s Podcast.
                        Each episode features deep insights from product leaders.
                    </p>

                    {/* Search */}
                    <div className="relative max-w-xl mx-auto">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xl">🔍</span>
                        <input
                            type="text"
                            placeholder="Search by guest, company, or title..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="search-input"
                        />
                    </div>
                </section>

                {/* Stats */}
                <section className="clay-card bg-gradient-to-r from-brand-start/5 via-brand-mid/5 to-brand-end/5 mb-8">
                    <div className="flex flex-wrap justify-center gap-8">
                        <div className="text-center">
                            <div className="text-3xl font-bold gradient-text">{episodes.length}</div>
                            <div className="text-sm text-gray-600">Episodes</div>
                        </div>
                        <div className="text-center">
                            <div className="text-3xl font-bold gradient-text">{methodologies.length}</div>
                            <div className="text-sm text-gray-600">Methodologies</div>
                        </div>
                        <div className="text-center">
                            <div className="text-3xl font-bold gradient-text">
                                {Math.round(methodologies.length / episodes.length * 10) / 10}
                            </div>
                            <div className="text-sm text-gray-600">Avg per Episode</div>
                        </div>
                    </div>
                </section>

                {/* Alphabet Navigation */}
                <div className="flex flex-wrap justify-center gap-2 mb-8">
                    {Object.keys(groupedEpisodes).sort().map(letter => (
                        <a
                            key={letter}
                            href={`#letter-${letter}`}
                            className="w-8 h-8 flex items-center justify-center bg-white/80 rounded-lg text-sm font-semibold hover:bg-brand-start hover:text-white transition-colors"
                        >
                            {letter}
                        </a>
                    ))}
                </div>

                {/* Episode List */}
                <section className="space-y-8">
                    {Object.keys(groupedEpisodes).sort().map(letter => (
                        <div key={letter} id={`letter-${letter}`}>
                            <h2 className="text-2xl font-bold mb-4 gradient-text">{letter}</h2>
                            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                                {groupedEpisodes[letter].map(episode => (
                                    <Link
                                        key={episode.id}
                                        href={`/episodes/${episode.slug}`}
                                        className="clay-card hover:shadow-clay-hover transition-all group"
                                    >
                                        <div className="flex items-start gap-4">
                                            <div className="w-12 h-12 rounded-full bg-gradient-brand flex items-center justify-center text-white text-xl font-bold shrink-0">
                                                {episode.name[0]}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h3 className="font-semibold text-gray-900 group-hover:text-brand-start transition-colors truncate">
                                                    {episode.name}
                                                </h3>
                                                <p className="text-sm text-gray-600 truncate">{episode.title}</p>
                                                <p className="text-sm text-gray-500 truncate">{episode.company}</p>
                                                <div className="flex items-center gap-2 mt-2">
                                                    <span className="text-xs px-2 py-1 bg-brand-start/10 text-brand-start rounded-full">
                                                        {episode.methodologyCount} methodologies
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    ))}
                </section>

                {filteredEpisodes.length === 0 && (
                    <div className="clay-card text-center py-12">
                        <p className="text-2xl mb-2">🔍</p>
                        <p className="text-gray-600">No episodes found for &quot;{searchQuery}&quot;</p>
                    </div>
                )}
            </main>
        </div>
    );
}
