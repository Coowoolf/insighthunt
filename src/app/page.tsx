'use client';

import { useState, useMemo } from 'react';
import { Header } from '@/components/Header';
import { MethodologyCard } from '@/components/MethodologyCard';
import { CategoryFilter } from '@/components/CategoryFilter';
import { StatsBanner } from '@/components/StatsBanner';
import { getAllMethodologies } from '@/data/insights';
import { Category } from '@/types';

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);

  const allMethodologies = getAllMethodologies();

  const filteredMethodologies = useMemo(() => {
    return allMethodologies.filter(m => {
      const matchesSearch = searchQuery === '' ||
        m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.guestName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesCategory = selectedCategory === null || m.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [allMethodologies, searchQuery, selectedCategory]);

  const sortedMethodologies = useMemo(() => {
    return [...filteredMethodologies].sort((a, b) => b.upvotes - a.upvotes);
  }, [filteredMethodologies]);

  return (
    <div className="min-h-screen">
      {/* Ambient Decorations */}
      <div className="ambient-sphere ambient-sphere-1" />
      <div className="ambient-sphere ambient-sphere-2" />
      <div className="ambient-sphere ambient-sphere-3" />

      <Header />

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Hero Section */}
        <section className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4">
            <span className="gradient-text">Hunt the Insights</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
            300+ product methodologies from the world&apos;s best PMs, extracted from Lenny&apos;s Podcast.
            Discover frameworks from Marty Cagan, Shreyas Doshi, Julie Zhuo, and more.
          </p>

          {/* Search Bar */}
          <div className="relative max-w-xl mx-auto">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xl">🔍</span>
            <input
              type="text"
              placeholder="Search methodologies, guests, or topics..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
          </div>
        </section>

        {/* Category Filter */}
        <section className="mb-8">
          <StatsBanner className="mb-6" />
          <CategoryFilter
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
          />
        </section>

        {/* Results Count */}
        <div className="mb-6 flex items-center justify-between">
          <p className="text-gray-600">
            Showing <span className="font-semibold text-brand-start">{sortedMethodologies.length}</span> methodologies
            {selectedCategory && <span> in {selectedCategory.replace('-', ' ')}</span>}
            {searchQuery && <span> matching &ldquo;{searchQuery}&rdquo;</span>}
          </p>
          <div className="text-sm text-gray-500">
            Sorted by popularity
          </div>
        </div>

        {/* Methodology Grid */}
        <section className="space-y-6">
          {sortedMethodologies.map(methodology => (
            <MethodologyCard key={methodology.id} methodology={methodology} />
          ))}

          {sortedMethodologies.length === 0 && (
            <div className="clay-card text-center py-12">
              <p className="text-2xl mb-2">🔍</p>
              <p className="text-gray-600">No methodologies found. Try a different search or category.</p>
            </div>
          )}
        </section>

        {/* Footer CTA */}
        <section className="mt-16 text-center">
          <div className="clay-card bg-gradient-to-r from-brand-start/5 via-brand-mid/5 to-brand-end/5">
            <h3 className="text-2xl font-bold mb-2 gradient-text">Coming Soon: 300+ More Insights</h3>
            <p className="text-gray-600 mb-4">
              We&apos;re extracting methodologies from all 297 episodes of Lenny&apos;s Podcast.
              Follow for updates!
            </p>
            <a
              href="https://twitter.com/lennysan"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block px-6 py-3 bg-gradient-brand text-white font-semibold rounded-xl hover:shadow-clay transition-all"
            >
              Follow @lennysan
            </a>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="mt-16 py-8 border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-6 text-center text-gray-500 text-sm">
          <p className="mb-2">
            <span className="gradient-text font-semibold">InsightHunt</span> — Part of the Hunt Series
          </p>
          <p>
            Made with 💜 for the PM community. Based on <a href="https://www.lennyspodcast.com/" className="text-brand-start hover:underline">Lenny&apos;s Podcast</a>.
          </p>
        </div>
      </footer>
    </div>
  );
}
