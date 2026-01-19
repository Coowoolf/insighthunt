'use client';

import { useState, useMemo } from 'react';
import { getAllGuests } from '@/data/insights';
import { useLanguage } from '@/context/LanguageContext';

interface GuestFilterProps {
    selectedGuest: string | null;
    onGuestChange: (guestSlug: string | null) => void;
}

export function GuestFilter({ selectedGuest, onGuestChange }: GuestFilterProps) {
    const { t } = useLanguage();
    const [isOpen, setIsOpen] = useState(false);
    const [filterQuery, setFilterQuery] = useState('');

    const guests = getAllGuests();

    // Get unique companies and sort guests by name
    const sortedGuests = useMemo(() => {
        return [...guests].sort((a, b) => a.name.localeCompare(b.name));
    }, [guests]);

    const filteredGuests = useMemo(() => {
        if (!filterQuery) return sortedGuests.slice(0, 20); // Show first 20 by default
        const q = filterQuery.toLowerCase();
        return sortedGuests.filter(g =>
            g.name.toLowerCase().includes(q) ||
            (g.company && g.company.toLowerCase().includes(q))
        ).slice(0, 20);
    }, [sortedGuests, filterQuery]);

    const selectedGuestObj = guests.find(g => g.slug === selectedGuest);

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${selectedGuest
                        ? 'bg-gradient-to-r from-brand-start to-brand-mid text-white'
                        : 'bg-white/60 hover:bg-white/80 text-gray-700 border border-gray-200'
                    }`}
            >
                <span className="mr-1">👤</span>
                {selectedGuestObj ? selectedGuestObj.name : t('Filter by Guest', '按嘉宾筛选')}
                <span className="ml-2">▼</span>
            </button>

            {isOpen && (
                <div className="absolute top-full mt-2 left-0 bg-white rounded-xl shadow-xl border border-gray-100 p-3 z-50 w-72 max-h-80 overflow-hidden">
                    {/* Search within dropdown */}
                    <input
                        type="text"
                        placeholder={t('Search guests or companies...', '搜索嘉宾或公司...')}
                        value={filterQuery}
                        onChange={(e) => setFilterQuery(e.target.value)}
                        className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg mb-2 focus:outline-none focus:ring-2 focus:ring-brand-start/50"
                    />

                    {/* Clear filter */}
                    {selectedGuest && (
                        <button
                            onClick={() => {
                                onGuestChange(null);
                                setIsOpen(false);
                            }}
                            className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg mb-2"
                        >
                            ✕ {t('Clear filter', '清除筛选')}
                        </button>
                    )}

                    {/* Guest list */}
                    <div className="overflow-y-auto max-h-48 space-y-1">
                        {filteredGuests.map(guest => (
                            <button
                                key={guest.slug}
                                onClick={() => {
                                    onGuestChange(guest.slug);
                                    setIsOpen(false);
                                    setFilterQuery('');
                                }}
                                className={`w-full text-left px-3 py-2 text-sm rounded-lg transition-colors ${selectedGuest === guest.slug
                                        ? 'bg-brand-start/10 text-brand-start'
                                        : 'hover:bg-gray-50'
                                    }`}
                            >
                                <div className="font-medium">{guest.name}</div>
                                {guest.company && (
                                    <div className="text-xs text-gray-500">{guest.company}</div>
                                )}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Click outside to close */}
            {isOpen && (
                <div
                    className="fixed inset-0 z-40"
                    onClick={() => setIsOpen(false)}
                />
            )}
        </div>
    );
}
