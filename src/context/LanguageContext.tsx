'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Language = 'en' | 'zh';

interface LanguageContextType {
    language: Language;
    setLanguage: (lang: Language) => void;
    t: (en: string, zh?: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// UI translations
const uiTranslations: Record<string, { en: string; zh: string }> = {
    // Navigation
    'nav.home': { en: 'Home', zh: '首页' },
    'nav.methodologies': { en: 'Methodologies', zh: '方法论' },
    'nav.guests': { en: 'Guests', zh: '嘉宾' },

    // Home page
    'home.title': { en: 'Hunt the Insights from the Best Product Minds', zh: '从顶尖产品思想家那里猎取洞见' },
    'home.subtitle': { en: 'Product methodologies extracted from Lenny\'s Podcast', zh: '从 Lenny\'s Podcast 中提炼的产品方法论' },
    'home.search_placeholder': { en: 'Search methodologies...', zh: '搜索方法论...' },
    'home.more_coming': { en: 'More coming soon', zh: '更多即将上线' },

    // Stats
    'stats.guests': { en: 'Guests', zh: '嘉宾' },
    'stats.methodologies': { en: 'Methodologies', zh: '方法论' },

    // Methodology detail
    'methodology.summary': { en: 'Summary', zh: '概述' },
    'methodology.principles': { en: 'Key Principles', zh: '核心原则' },
    'methodology.problem': { en: 'Problem It Solves', zh: '解决的问题' },
    'methodology.when_to_use': { en: 'When to Use', zh: '适用场景' },
    'methodology.mistakes': { en: 'Common Mistakes', zh: '常见错误' },
    'methodology.example': { en: 'Real World Example', zh: '实际案例' },
    'methodology.quote': { en: 'Key Quote', zh: '金句' },
    'methodology.guest': { en: 'From Guest', zh: '来自嘉宾' },

    // Guest detail
    'guest.about': { en: 'About', zh: '关于' },
    'guest.background': { en: 'Background', zh: '背景' },
    'guest.methodologies': { en: 'Methodologies', zh: '方法论' },

    // Common
    'common.view_all': { en: 'View All', zh: '查看全部' },
    'common.learn_more': { en: 'Learn More', zh: '了解更多' },
    'common.back': { en: 'Back', zh: '返回' },
};

export function LanguageProvider({ children }: { children: ReactNode }) {
    const [language, setLanguageState] = useState<Language>('en');

    // Load language preference from localStorage on mount
    useEffect(() => {
        const saved = localStorage.getItem('insighthunt_lang') as Language;
        if (saved && (saved === 'en' || saved === 'zh')) {
            setLanguageState(saved);
        }
    }, []);

    const setLanguage = (lang: Language) => {
        setLanguageState(lang);
        localStorage.setItem('insighthunt_lang', lang);
        // Update html lang attribute
        document.documentElement.lang = lang;
    };

    // Translation function
    const t = (en: string, zh?: string): string => {
        // If key exists in UI translations, use it
        if (uiTranslations[en]) {
            return uiTranslations[en][language];
        }
        // Otherwise use provided zh or fallback to en
        if (language === 'zh' && zh) {
            return zh;
        }
        return en;
    };

    return (
        <LanguageContext.Provider value={{ language, setLanguage, t }}>
            {children}
        </LanguageContext.Provider>
    );
}

export function useLanguage() {
    const context = useContext(LanguageContext);
    if (context === undefined) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
}
