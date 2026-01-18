'use client';

import { Header } from '@/components/Header';
import { CategoryChart } from '@/components/CategoryChart';
import { getStats, getAllMethodologies, getAllGuests } from '@/data/insights';
import { CATEGORY_INFO, Category } from '@/types';

export default function StatsPage() {
    const stats = getStats();
    const methodologies = getAllMethodologies();
    const guests = getAllGuests();

    // Top guests by methodology count
    const topGuests = guests
        .map(g => ({
            ...g,
            count: methodologies.filter(m => m.guestId === g.slug).length
        }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 10);

    return (
        <div className="min-h-screen">
            <div className="ambient-sphere ambient-sphere-1" />
            <div className="ambient-sphere ambient-sphere-2" />

            <Header />

            <main className="max-w-6xl mx-auto px-6 py-8">
                {/* Hero */}
                <section className="text-center mb-12">
                    <h1 className="text-5xl font-bold mb-4">
                        <span className="gradient-text">📊 Data Overview</span>
                    </h1>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                        Explore the distribution of {stats.totalMethodologies} methodologies
                        from {stats.totalGuests} world-class product leaders.
                    </p>
                </section>

                {/* Key Stats */}
                <section className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
                    <div className="clay-card text-center">
                        <div className="text-4xl font-bold gradient-text">{stats.totalEpisodes}</div>
                        <div className="text-sm text-gray-600 mt-1">Episodes</div>
                    </div>
                    <div className="clay-card text-center">
                        <div className="text-4xl font-bold gradient-text">{stats.totalGuests}</div>
                        <div className="text-sm text-gray-600 mt-1">Guests</div>
                    </div>
                    <div className="clay-card text-center">
                        <div className="text-4xl font-bold gradient-text">{stats.totalMethodologies}</div>
                        <div className="text-sm text-gray-600 mt-1">Methodologies</div>
                    </div>
                    <div className="clay-card text-center">
                        <div className="text-4xl font-bold gradient-text">6</div>
                        <div className="text-sm text-gray-600 mt-1">Categories</div>
                    </div>
                </section>

                {/* Category Distribution */}
                <section className="clay-card mb-12">
                    <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                        <span>📈</span>
                        <span className="gradient-text">Category Distribution</span>
                    </h2>
                    <div className="grid md:grid-cols-2 gap-8">
                        <div>
                            <h3 className="text-lg font-semibold mb-4 text-center">Pie Chart</h3>
                            <CategoryChart type="pie" showLegend={false} />
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold mb-4 text-center">Bar Chart</h3>
                            <CategoryChart type="bar" />
                        </div>
                    </div>
                </section>

                {/* Top Contributors */}
                <section className="clay-card mb-12">
                    <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                        <span>🏆</span>
                        <span className="gradient-text">Top Contributors</span>
                    </h2>
                    <div className="grid md:grid-cols-2 gap-4">
                        {topGuests.map((guest, index) => (
                            <div key={guest.id} className="flex items-center gap-4 p-4 bg-white/60 rounded-xl">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold ${index === 0 ? 'bg-yellow-500' :
                                        index === 1 ? 'bg-gray-400' :
                                            index === 2 ? 'bg-orange-600' : 'bg-gray-300'
                                    }`}>
                                    {index + 1}
                                </div>
                                <div className="flex-1">
                                    <div className="font-semibold">{guest.name}</div>
                                    <div className="text-sm text-gray-600">{guest.company}</div>
                                </div>
                                <div className="text-lg font-bold gradient-text">{guest.count}</div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Category Details */}
                <section className="clay-card">
                    <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                        <span>📂</span>
                        <span className="gradient-text">Category Details</span>
                    </h2>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {(Object.entries(stats.categories) as [Category, number][])
                            .sort((a, b) => b[1] - a[1])
                            .map(([category, count]) => {
                                const info = CATEGORY_INFO[category];
                                const percentage = ((count / stats.totalMethodologies) * 100).toFixed(1);
                                return (
                                    <div key={category} className="p-4 bg-white/60 rounded-xl">
                                        <div className="flex items-center gap-2 mb-2">
                                            <span className="text-2xl">{info.emoji}</span>
                                            <span className="font-semibold">{info.label}</span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-3xl font-bold gradient-text">{count}</span>
                                            <span className="text-sm text-gray-500">{percentage}%</span>
                                        </div>
                                        <div className="mt-2 h-2 bg-gray-200 rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-gradient-brand rounded-full"
                                                style={{ width: `${percentage}%` }}
                                            />
                                        </div>
                                    </div>
                                );
                            })}
                    </div>
                </section>
            </main>
        </div>
    );
}
