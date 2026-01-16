'use client';

import Link from 'next/link';

export function Header() {
    return (
        <header className="glass-header sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-6 py-4">
                <div className="flex items-center justify-between">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-brand flex items-center justify-center text-white text-xl">
                            💡
                        </div>
                        <div>
                            <h1 className="text-xl font-bold gradient-text">InsightHunt</h1>
                            <p className="text-xs text-gray-500">Hunt the Insights</p>
                        </div>
                    </Link>

                    {/* Navigation */}
                    <nav className="hidden md:flex items-center gap-6">
                        <Link href="/" className="text-gray-600 hover:text-brand-start transition-colors font-medium">
                            Methodologies
                        </Link>
                        <Link href="/guests" className="text-gray-600 hover:text-brand-start transition-colors font-medium">
                            Guests
                        </Link>
                        <Link href="/about" className="text-gray-600 hover:text-brand-start transition-colors font-medium">
                            About
                        </Link>
                    </nav>

                    {/* Stats */}
                    <div className="hidden sm:flex items-center gap-4 text-sm">
                        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-brand-start/10 to-brand-mid/10">
                            <span className="text-brand-start">🎙️</span>
                            <span className="font-semibold text-gray-700">297 Episodes</span>
                        </div>
                        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-primary-orange/10 to-primary-gold/10">
                            <span className="text-primary-orange">💡</span>
                            <span className="font-semibold text-gray-700">300+ Insights</span>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
}
