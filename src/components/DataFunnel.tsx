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
    const { t, language } = useLanguage();
    const prefix = language === 'zh' ? '/cn' : '';

    const stages = [
        {
            emoji: '🎙️',
            value: episodes,
            label: t('Raw Episodes', '原始播客'),
            sublabel: t('Lenny\'s Podcast Archive', 'Lenny Podcast 档案'),
            href: `${prefix}/episodes`,
            bgColor: 'bg-gradient-to-r from-violet-500 to-purple-600',
            widthPercent: 100,
        },
        {
            emoji: '📚',
            value: methodologies,
            label: t('Methodologies', '方法论'),
            sublabel: t('Extracted & Analyzed', '提取 & 分析'),
            href: `${prefix}/methodologies`,
            bgColor: 'bg-gradient-to-r from-pink-500 to-rose-500',
            widthPercent: 80,
        },
        {
            emoji: '🎓',
            value: skills,
            label: t('Skills', '技能包'),
            sublabel: t('Actionable & Downloadable', '可操作 & 可下载'),
            href: `${prefix}/skills`,
            bgColor: 'bg-gradient-to-r from-emerald-500 to-teal-500',
            widthPercent: 55,
        },
    ];

    return (
        <div className={`clay-card ${className}`}>
            <h2 className="text-2xl font-bold flex items-center gap-2 mb-8 text-center justify-center">
                <span>📊</span>
                <span className="gradient-text">{t('Data at a Glance', '数据一览')}</span>
            </h2>

            <div className="space-y-3">
                {stages.map((stage, index) => (
                    <div key={stage.label}>
                        <Link
                            href={stage.href}
                            className="block group"
                        >
                            <div
                                className={`relative rounded-2xl p-4 ${stage.bgColor} text-white transition-all hover:shadow-lg hover:scale-[1.01] mx-auto`}
                                style={{ width: `${stage.widthPercent}%` }}
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
                        </Link>

                        {index < stages.length - 1 && (
                            <div className="flex justify-center py-1">
                                <span className="text-xl text-gray-300">↓</span>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            <p className="text-center text-sm text-gray-500 mt-6">
                {t(
                    'From raw podcasts to actionable skills — our AI-powered pipeline',
                    '从原始播客到可操作技能 — 我们的 AI 驱动流水线'
                )}
            </p>
        </div>
    );
}
