'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import LanguageSwitcher from './LanguageSwitcher';

export function Header() {
    const pathname = usePathname();
    const isChineseRoute = pathname.startsWith('/cn');

    // Route-based translation - EN route always shows English, /cn shows Chinese
    const t = (en: string, zh: string) => isChineseRoute ? zh : en;
    const homeLink = isChineseRoute ? '/cn' : '/';
    const guestsLink = isChineseRoute ? '/cn/guests' : '/guests';

    return (
        <header className="glass-header sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-6 py-4">
                <div className="flex items-center justify-between">
                    {/* Logo */}
                    <Link href={homeLink} className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-brand flex items-center justify-center text-white text-xl">
                            💡
                        </div>
                        <div>
                            <h1 className="text-xl font-bold gradient-text">InsightHunt</h1>
                            <p className="text-xs text-gray-500">{t('Hunt the Insights', '洞见狩猎')}</p>
                        </div>
                    </Link>

                    {/* Navigation */}
                    <nav className="hidden md:flex items-center gap-6">
                        <Link href={homeLink} className="text-gray-600 hover:text-brand-start transition-colors font-medium">
                            {t('Methodologies', '方法论')}
                        </Link>
                        <Link href={guestsLink} className="text-gray-600 hover:text-brand-start transition-colors font-medium">
                            {t('Guests', '嘉宾')}
                        </Link>
                    </nav>

                    {/* Stats + Language Switcher */}
                    <div className="flex items-center gap-3">
                        <div className="hidden sm:flex items-center gap-3 text-sm">
                            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-brand-start/10 to-brand-mid/10">
                                <span className="text-brand-start">🎙️</span>
                                <span className="font-semibold text-gray-700">297 {t('Episodes', '期节目')}</span>
                            </div>
                            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-primary-orange/10 to-primary-gold/10">
                                <span className="text-primary-orange">💡</span>
                                <span className="font-semibold text-gray-700">300+ {t('Insights', '洞见')}</span>
                            </div>
                        </div>
                        <LanguageSwitcher />
                    </div>
                </div>
            </div>
        </header>
    );
}


