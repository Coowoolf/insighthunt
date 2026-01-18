'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import { Header } from '@/components/Header';
import { MethodologyCard } from '@/components/MethodologyCard';
import { DataFunnel } from '@/components/DataFunnel';
import { CategoryChart } from '@/components/CategoryChart';
import { getAllMethodologies, getAllGuests, getStats } from '@/data/insights';
import { CATEGORY_INFO, Category } from '@/types';
import { useLanguage } from '@/context/LanguageContext';

export default function Home() {
  const { t } = useLanguage();
  const stats = getStats();
  const allMethodologies = getAllMethodologies();
  const allGuests = getAllGuests();

  // Latest 3 episodes (by episode number, descending)
  const latestEpisodes = useMemo(() => {
    return [...allGuests]
      .sort((a, b) => (b.episodeNumber || 0) - (a.episodeNumber || 0))
      .slice(0, 3);
  }, [allGuests]);

  // Featured 6 methodologies (by upvotes)
  const featuredMethodologies = useMemo(() => {
    return [...allMethodologies]
      .sort((a, b) => b.upvotes - a.upvotes)
      .slice(0, 6);
  }, [allMethodologies]);

  // Category data
  const categories = Object.entries(CATEGORY_INFO) as [Category, typeof CATEGORY_INFO[Category]][];

  return (
    <div className="min-h-screen">
      <div className="ambient-sphere ambient-sphere-1" />
      <div className="ambient-sphere ambient-sphere-2" />
      <div className="ambient-sphere ambient-sphere-3" />

      <Header />

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Hero Section */}
        <section className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            <span className="gradient-text">{t('Hunt the Insights', '洞见狩猎')}</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            {t(
              'Your gateway to 689 product methodologies and 74 actionable skills extracted from Lenny\'s Podcast.',
              '从 Lenny Podcast 提炼的 689 个产品方法论和 74 个可操作技能。'
            )}
          </p>

          {/* Search Bar */}
          <Link href="/methodologies" className="relative max-w-xl mx-auto block group">
            <div className="search-input cursor-pointer flex items-center gap-3 text-gray-400 group-hover:shadow-clay transition-all">
              <span className="text-xl">🔍</span>
              <span>{t('Search methodologies, guests, or topics...', '搜索方法论、嘉宾或话题...')}</span>
            </div>
          </Link>
        </section>

        {/* Data Visualization Section */}
        <section className="grid md:grid-cols-2 gap-6 mb-16">
          {/* Data Funnel */}
          <DataFunnel
            episodes={stats.totalEpisodes}
            methodologies={stats.totalMethodologies}
            skills={74}
          />

          {/* Category Distribution */}
          <div className="clay-card">
            <h2 className="text-2xl font-bold flex items-center gap-2 mb-6 text-center justify-center">
              <span>📊</span>
              <span className="gradient-text">{t('Category Distribution', '分类分布')}</span>
            </h2>
            <CategoryChart type="pie" showLegend={true} />
          </div>
        </section>

        {/* Latest Episodes */}
        <section className="mb-16">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <span>🎙️</span>
              <span className="gradient-text">{t('Latest Episodes', '最新播客')}</span>
            </h2>
            <Link href="/episodes" className="text-brand-start hover:underline text-sm font-medium">
              {t('View all →', '查看全部 →')}
            </Link>
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            {latestEpisodes.map((guest) => (
              <Link
                key={guest.id}
                href={`/episodes/${guest.slug}`}
                className="clay-card hover:shadow-clay-hover transition-all group"
              >
                <div className="text-sm text-brand-start mb-2">
                  {t('Episode', '第')} #{guest.episodeNumber || '—'}
                </div>
                <h3 className="font-bold text-lg mb-1 group-hover:text-brand-start transition-colors">
                  {guest.name}
                </h3>
                <p className="text-sm text-gray-600">{guest.title}</p>
                <p className="text-xs text-gray-400 mt-2">{guest.company}</p>
              </Link>
            ))}
          </div>
        </section>

        {/* Featured Methodologies */}
        <section className="mb-16">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <span>⭐</span>
              <span className="gradient-text">{t('Featured Methodologies', '精选方法论')}</span>
            </h2>
            <Link href="/methodologies" className="text-brand-start hover:underline text-sm font-medium">
              {t('View all →', '查看全部 →')}
            </Link>
          </div>
          <div className="space-y-4">
            {featuredMethodologies.map((methodology) => (
              <MethodologyCard key={methodology.id} methodology={methodology} />
            ))}
          </div>
        </section>

        {/* Browse by Category */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold flex items-center gap-2 mb-6">
            <span>📂</span>
            <span className="gradient-text">{t('Browse by Category', '按分类浏览')}</span>
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {categories.map(([key, info]) => (
              <Link
                key={key}
                href={`/methodologies?category=${key}`}
                className="clay-card hover:shadow-clay-hover transition-all group flex items-center gap-4"
              >
                <span className="text-3xl">{info.emoji}</span>
                <div className="flex-1">
                  <h3 className="font-bold group-hover:text-brand-start transition-colors">
                    {info.label}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {stats.categories[key] || 0} {t('methodologies', '个方法论')}
                  </p>
                </div>
                <span className="text-gray-400 group-hover:text-brand-start">→</span>
              </Link>
            ))}
          </div>
        </section>

        {/* Skills Section */}
        <section className="mb-16">
          <div className="clay-card bg-gradient-to-r from-emerald-500/5 via-teal-500/5 to-cyan-500/5 text-center py-12">
            <div className="text-5xl mb-4">🎓</div>
            <h3 className="text-3xl font-bold mb-4">
              <span className="bg-gradient-to-r from-emerald-500 to-teal-500 bg-clip-text text-transparent">
                74 {t('Actionable Skills', '个可操作技能')}
              </span>
            </h3>
            <p className="text-gray-600 max-w-xl mx-auto mb-8">
              {t(
                'Methodologies transformed into downloadable skill packs with templates, exercises, and real-world examples.',
                '方法论转化为可下载的技能包，包含模板、练习和真实案例。'
              )}
            </p>
            <div className="flex flex-wrap justify-center gap-3 mb-8">
              {['Product Growth (16)', 'Team Leadership (17)', 'Decision Thinking (10)', 'Strategy Planning (10)'].map((category) => (
                <span key={category} className="px-3 py-1 bg-white/60 rounded-full text-sm text-gray-600">
                  {category}
                </span>
              ))}
            </div>
            <a
              href="https://github.com/Coowoolf/insighthunt-skills"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-bold rounded-xl hover:shadow-lg transition-all"
            >
              <span>📦</span>
              <span>{t('Browse Skills on GitHub', '在 GitHub 浏览技能包')}</span>
              <span>→</span>
            </a>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="py-8 border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-6 text-center text-gray-500 text-sm">
          <p className="mb-2">
            <span className="gradient-text font-semibold">InsightHunt</span> — {t('Part of the Hunt Series', 'Hunt 系列产品')}
          </p>
          <p>
            {t('Made with', '用')} 💜 {t('for the PM community. Based on', '为 PM 社区打造。基于')}{' '}
            <a href="https://www.lennyspodcast.com/" className="text-brand-start hover:underline">
              Lenny&apos;s Podcast
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}
