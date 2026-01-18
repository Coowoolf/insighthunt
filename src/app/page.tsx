'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import { Header } from '@/components/Header';
import { MethodologyCard } from '@/components/MethodologyCard';
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
        <section className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            <span className="gradient-text">{t('Hunt the Insights', '洞见狩猎')}</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            {t(
              'Your gateway to 689+ product methodologies extracted from Lenny\'s Podcast. Learn from the world\'s best PMs.',
              '从 Lenny Podcast 提炼的 689+ 产品方法论。向世界顶级产品经理学习。'
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

        {/* Stats Banner */}
        <section className="grid grid-cols-3 gap-4 mb-16">
          <Link href="/episodes" className="clay-card text-center hover:shadow-clay-hover transition-all">
            <div className="text-4xl font-bold gradient-text">{stats.totalEpisodes}</div>
            <div className="text-sm text-gray-600 mt-1">{t('Episodes', '期节目')}</div>
          </Link>
          <Link href="/methodologies" className="clay-card text-center hover:shadow-clay-hover transition-all">
            <div className="text-4xl font-bold gradient-text">{stats.totalMethodologies}</div>
            <div className="text-sm text-gray-600 mt-1">{t('Methodologies', '个方法论')}</div>
          </Link>
          <Link href="/guests" className="clay-card text-center hover:shadow-clay-hover transition-all">
            <div className="text-4xl font-bold gradient-text">{stats.totalGuests}</div>
            <div className="text-sm text-gray-600 mt-1">{t('Guests', '位嘉宾')}</div>
          </Link>
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

        {/* Coming Soon: Skills */}
        <section className="mb-16">
          <div className="clay-card bg-gradient-to-r from-brand-start/5 via-brand-mid/5 to-brand-end/5 text-center py-12">
            <div className="text-4xl mb-4">🎓</div>
            <h3 className="text-2xl font-bold mb-2 gradient-text">
              {t('Coming Soon: Downloadable Skills', '即将推出：可下载的技能包')}
            </h3>
            <p className="text-gray-600 max-w-xl mx-auto mb-6">
              {t(
                'Transform methodologies into actionable skill packs. Practice frameworks with templates and exercises.',
                '将方法论转化为可操作的技能包。通过模板和练习实践框架。'
              )}
            </p>
            <div className="inline-flex items-center gap-2 px-6 py-3 bg-white/60 rounded-full text-gray-600">
              <span>🚀</span>
              <span>{t('Stay tuned for updates', '敬请期待')}</span>
            </div>
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
