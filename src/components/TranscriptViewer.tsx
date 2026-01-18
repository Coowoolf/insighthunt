'use client';

import { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';

interface TranscriptViewerProps {
    enTranscript: string;
    zhTranscript?: string;
}

export function TranscriptViewer({ enTranscript, zhTranscript }: TranscriptViewerProps) {
    const { t, language } = useLanguage();
    const [activeTab, setActiveTab] = useState<'en' | 'zh'>(language === 'zh' ? 'zh' : 'en');
    const [isExpanded, setIsExpanded] = useState(false);

    const hasZhTranscript = zhTranscript && zhTranscript.length > 0;
    const currentTranscript = activeTab === 'zh' && hasZhTranscript ? zhTranscript : enTranscript;

    // Show preview (first 2000 chars) or full content
    const displayContent = isExpanded
        ? currentTranscript
        : currentTranscript.slice(0, 2000) + (currentTranscript.length > 2000 ? '...' : '');

    return (
        <div className="clay-card">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold flex items-center gap-2">
                    <span>📝</span>
                    <span className="gradient-text">{t('Full Transcript', '完整转录')}</span>
                </h2>

                {/* Language Tabs */}
                <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
                    <button
                        onClick={() => setActiveTab('en')}
                        className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${activeTab === 'en'
                                ? 'bg-white shadow-sm text-brand-start'
                                : 'text-gray-600 hover:text-gray-900'
                            }`}
                    >
                        English
                    </button>
                    <button
                        onClick={() => setActiveTab('zh')}
                        disabled={!hasZhTranscript}
                        className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${activeTab === 'zh'
                                ? 'bg-white shadow-sm text-brand-start'
                                : hasZhTranscript
                                    ? 'text-gray-600 hover:text-gray-900'
                                    : 'text-gray-300 cursor-not-allowed'
                            }`}
                    >
                        中文 {!hasZhTranscript && '(翻译中)'}
                    </button>
                </div>
            </div>

            {/* Word count */}
            <div className="text-sm text-gray-500 mb-4">
                {activeTab === 'en'
                    ? `${enTranscript.split(/\s+/).length.toLocaleString()} words`
                    : `${(zhTranscript?.length || 0).toLocaleString()} 字符`
                }
            </div>

            {/* Transcript Content */}
            <div className="prose prose-gray max-w-none">
                <div
                    className="whitespace-pre-wrap text-gray-700 leading-relaxed text-sm"
                    style={{ maxHeight: isExpanded ? 'none' : '400px', overflow: 'hidden' }}
                >
                    {displayContent}
                </div>
            </div>

            {/* Expand/Collapse Button */}
            {currentTranscript.length > 2000 && (
                <div className="mt-4 text-center">
                    <button
                        onClick={() => setIsExpanded(!isExpanded)}
                        className="inline-flex items-center gap-2 px-6 py-2 bg-gradient-brand text-white font-medium rounded-lg hover:shadow-lg transition-all"
                    >
                        {isExpanded
                            ? t('Show Less', '收起')
                            : t('Read Full Transcript', '阅读完整转录')
                        }
                        <span>{isExpanded ? '↑' : '↓'}</span>
                    </button>
                </div>
            )}
        </div>
    );
}
