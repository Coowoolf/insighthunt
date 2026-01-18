'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { usePathname, useRouter } from 'next/navigation';

type Language = 'en' | 'zh';

interface LanguageContextType {
    language: Language;
    setLanguage: (lang: Language) => void;
    t: (en: string, zh?: string) => string;
    isTransitioning: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
    const pathname = usePathname();
    const router = useRouter();

    // Derive language from route
    const isChineseRoute = pathname.startsWith('/cn');
    const [language, setLanguageState] = useState<Language>(isChineseRoute ? 'zh' : 'en');
    const [isTransitioning, setIsTransitioning] = useState(false);

    // Sync language with route
    useEffect(() => {
        setLanguageState(isChineseRoute ? 'zh' : 'en');
    }, [pathname, isChineseRoute]);

    const setLanguage = (lang: Language) => {
        if (lang === language) return;

        setIsTransitioning(true);

        // Calculate new path
        let newPath: string;
        if (lang === 'zh') {
            newPath = pathname === '/' ? '/cn' : `/cn${pathname}`;
        } else {
            newPath = pathname.replace(/^\/cn/, '') || '/';
        }

        // Use scroll: false for smoother navigation (no scroll jump)
        router.push(newPath, { scroll: false });

        // Reset transition state
        setTimeout(() => setIsTransitioning(false), 150);
    };

    // Translation helper - returns Chinese if language is zh and zh provided
    const t = (en: string, zh?: string): string => {
        if (language === 'zh' && zh) {
            return zh;
        }
        return en;
    };

    return (
        <LanguageContext.Provider value={{ language, setLanguage, t, isTransitioning }}>
            <div className={`transition-opacity duration-150 ${isTransitioning ? 'opacity-90' : 'opacity-100'}`}>
                {children}
            </div>
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
