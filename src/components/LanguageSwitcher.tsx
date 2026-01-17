'use client';

import { useLanguage } from '@/context/LanguageContext';

export default function LanguageSwitcher() {
    const { language, setLanguage } = useLanguage();

    return (
        <div className="flex items-center gap-1 bg-white/80 backdrop-blur-sm rounded-full px-2 py-1 border border-gray-200 shadow-sm">
            <button
                onClick={() => setLanguage('en')}
                className={`px-2 py-0.5 rounded-full text-sm font-medium transition-all ${language === 'en'
                        ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
            >
                EN
            </button>
            <span className="text-gray-300">|</span>
            <button
                onClick={() => setLanguage('zh')}
                className={`px-2 py-0.5 rounded-full text-sm font-medium transition-all ${language === 'zh'
                        ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
            >
                中
            </button>
        </div>
    );
}
