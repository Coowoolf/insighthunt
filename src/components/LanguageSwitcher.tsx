'use client';

import { useLanguage } from '@/context/LanguageContext';

export default function LanguageSwitcher() {
    const { language, setLanguage, isTransitioning } = useLanguage();

    return (
        <div className={`flex items-center gap-0.5 bg-white/90 backdrop-blur-md rounded-full p-1 border border-gray-200/50 shadow-lg transition-all duration-200 ${isTransitioning ? 'scale-95 opacity-80' : 'scale-100 opacity-100'}`}>
            <button
                onClick={() => setLanguage('en')}
                disabled={isTransitioning}
                aria-label="Switch to English"
                className={`relative px-3 py-1.5 rounded-full text-sm font-semibold transition-all duration-200 ${language === 'en'
                        ? 'bg-gradient-to-r from-brand-start to-brand-mid text-white shadow-md'
                        : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100/80'
                    }`}
            >
                EN
            </button>

            <button
                onClick={() => setLanguage('zh')}
                disabled={isTransitioning}
                aria-label="切换到中文"
                className={`relative px-3 py-1.5 rounded-full text-sm font-semibold transition-all duration-200 ${language === 'zh'
                        ? 'bg-gradient-to-r from-brand-start to-brand-mid text-white shadow-md'
                        : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100/80'
                    }`}
            >
                中文
            </button>
        </div>
    );
}
