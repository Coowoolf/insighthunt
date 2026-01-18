'use client';

import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';

interface DataFunnelProps {
    episodes: number;
    methodologies: number;
    skills: number;
    className?: string;
}

export function DataFunnel({ episodes, methodologies, skills, className = '' }: DataFunnelProps) {
    const { t } = useLanguage();

    const stages = [
        {
            emoji: '🎙️',
            value: episodes,
            label: t('Raw Episodes', '原始播客'),
            sublabel: t('Lenny\'s Podcast Archive', 'Lenny Podcast 档案'),
            href: '/episodes',
            color: 'from-purple-500 to-violet-500',
            width: '100%',
        },
        {
            emoji: '📚',
            value: methodologies,
            label: t('Methodologies', '方法论'),
            sublabel: t('Extracted & Analyzed', '提取 & 分析'),
            href: '/methodologies',
            color: 'from-brand-start to-brand-mid',
            width: '75%',
        },
        {
            emoji: '🎓',
            value: skills,
            label: t('Skills', '技能包'),
            sublabel: t('Actionable & Downloadable', '可操作 & 可下载'),
            href: '/skills',
            color: 'from-emerald-500 to-teal-500',
            width: '50%',
        },
    ];

    return (
        <div className={`clay-card ${className}`}>
            <h2 className="text-2xl font-bold flex items-center gap-2 mb-8 text-center justify-center">
                <span>📊</span>
                <span className="gradient-text">{t('Data at a Glance', '数据一览')}</span>
            </h2>

            <div className="space-y-4">
                {stages.map((stage, index) => (
                    <Link
                        key={stage.label}
                        href={stage.href}
                        className="block group"
                    >
                        <div
                            className={`relative rounded-2xl p-4 bg-gradient-to-r ${stage.color} text-white transition-all hover:shadow-lg hover:scale-[1.02]`}
                            style={{ width: stage.width, marginLeft: 'auto', marginRight: 'auto' }}
                        >
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <span className="text-2xl">{stage.emoji}</span>
                                    <div>
                                        <div className="font-bold text-lg">{stage.label}</div>
                                        <div className="text-sm opacity-80">{stage.sublabel}</div>
                                    </div>
                                </div>
                                <div className="text-3xl font-bold">{stage.value}</div>
                            </div>
                        </div>

                        {index < stages.length - 1 && (
                            <div className="flex justify-center my-2">
                                <span className="text-2xl text-gray-400">↓</span>
                            </div>
                        )}
                    </Link>
                ))}
            </div>

            <p className="text-center text-sm text-gray-500 mt-6">
                {t(
                    'From raw podcasts to actionable skills — our AI-powered extraction pipeline',
                    '从原始播客到可操作技能 — 我们的 AI 驱动提取流水线'
                )}
            </p>
        </div>
    );
}
