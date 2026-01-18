'use client';

import Link from 'next/link';
import { Header } from '@/components/Header';
import { useLanguage } from '@/context/LanguageContext';

const SKILLS_DATA = [
    { category: 'product-growth', label: 'Product Growth', labelZh: '产品增长', count: 16, emoji: '📈' },
    { category: 'team-leadership', label: 'Team Leadership', labelZh: '团队领导', count: 17, emoji: '👥' },
    { category: 'decision-thinking', label: 'Decision & Thinking', labelZh: '决策与思维', count: 10, emoji: '🧠' },
    { category: 'strategy-planning', label: 'Strategy Planning', labelZh: '战略规划', count: 10, emoji: '🎯' },
    { category: 'career-development', label: 'Career Development', labelZh: '职业发展', count: 7, emoji: '🚀' },
    { category: 'user-research', label: 'User Research', labelZh: '用户研究', count: 6, emoji: '🔍' },
    { category: 'ai-engineering', label: 'AI Engineering', labelZh: 'AI 工程', count: 4, emoji: '🤖' },
    { category: 'organization-ops', label: 'Organization & Ops', labelZh: '组织运营', count: 4, emoji: '⚙️' },
];

const GITHUB_BASE_URL = 'https://github.com/Coowoolf/insighthunt-skills/tree/main';

export default function SkillsPage() {
    const { t } = useLanguage();
    const totalSkills = SKILLS_DATA.reduce((sum, cat) => sum + cat.count, 0);

    return (
        <div className="min-h-screen">
            <div className="ambient-sphere ambient-sphere-1" />
            <div className="ambient-sphere ambient-sphere-2" />

            <Header />

            <main className="max-w-7xl mx-auto px-6 py-8">
                {/* Hero */}
                <section className="text-center mb-12">
                    <div className="text-5xl mb-4">🎓</div>
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">
                        <span className="bg-gradient-to-r from-emerald-500 to-teal-500 bg-clip-text text-transparent">
                            {totalSkills} {t('Actionable Skills', '个可操作技能')}
                        </span>
                    </h1>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
                        {t(
                            'Methodologies transformed into downloadable skill packs with templates, frameworks, and real-world exercises.',
                            '方法论转化为可下载的技能包，包含模板、框架和实战练习。'
                        )}
                    </p>
                    <a
                        href={GITHUB_BASE_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-bold rounded-xl hover:shadow-lg transition-all"
                    >
                        <span>📦</span>
                        <span>{t('View All on GitHub', '在 GitHub 查看全部')}</span>
                        <span>→</span>
                    </a>
                </section>

                {/* Skills Grid */}
                <section className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {SKILLS_DATA.map((category) => (
                        <a
                            key={category.category}
                            href={`${GITHUB_BASE_URL}/${category.category}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="clay-card hover:shadow-clay-hover transition-all group"
                        >
                            <div className="text-4xl mb-4">{category.emoji}</div>
                            <h3 className="font-bold text-lg mb-1 group-hover:text-emerald-600 transition-colors">
                                {t(category.label, category.labelZh)}
                            </h3>
                            <p className="text-sm text-gray-500 mb-4">
                                {category.count} {t('skills', '个技能')}
                            </p>
                            <div className="flex items-center gap-2 text-sm text-emerald-600">
                                <span>📥</span>
                                <span>{t('Browse on GitHub', '在 GitHub 浏览')}</span>
                            </div>
                        </a>
                    ))}
                </section>

                {/* How Skills Work */}
                <section className="mt-16">
                    <div className="clay-card bg-gradient-to-br from-gray-50 to-white">
                        <h2 className="text-2xl font-bold mb-6 text-center">
                            <span className="gradient-text">{t('How Skills Work', '技能包使用方式')}</span>
                        </h2>
                        <div className="grid md:grid-cols-3 gap-8 text-center">
                            <div>
                                <div className="text-3xl mb-3">📖</div>
                                <h3 className="font-bold mb-2">{t('Learn', '学习')}</h3>
                                <p className="text-sm text-gray-600">
                                    {t('Read the skill guide with core concepts', '阅读技能指南，掌握核心概念')}
                                </p>
                            </div>
                            <div>
                                <div className="text-3xl mb-3">🛠️</div>
                                <h3 className="font-bold mb-2">{t('Practice', '实践')}</h3>
                                <p className="text-sm text-gray-600">
                                    {t('Use templates and frameworks provided', '使用提供的模板和框架')}
                                </p>
                            </div>
                            <div>
                                <div className="text-3xl mb-3">🎯</div>
                                <h3 className="font-bold mb-2">{t('Apply', '应用')}</h3>
                                <p className="text-sm text-gray-600">
                                    {t('Apply to your real projects', '应用到你的实际项目中')}
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Back to Methodologies CTA */}
                <section className="mt-12 text-center">
                    <p className="text-gray-600 mb-4">
                        {t('Skills are extracted from our 689+ methodologies', '技能来自我们 689+ 方法论的提取')}
                    </p>
                    <Link
                        href="/methodologies"
                        className="inline-flex items-center gap-2 text-brand-start hover:underline font-medium"
                    >
                        <span>📚</span>
                        <span>{t('Browse All Methodologies', '浏览全部方法论')}</span>
                        <span>→</span>
                    </Link>
                </section>
            </main>
        </div>
    );
}
