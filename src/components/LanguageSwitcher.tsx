'use client';

import { usePathname, useRouter } from 'next/navigation';

export default function LanguageSwitcher() {
    const pathname = usePathname();
    const router = useRouter();

    // Determine if currently on Chinese route
    const isChineseRoute = pathname.startsWith('/cn');

    const switchToEnglish = () => {
        if (isChineseRoute) {
            // Map /cn/... to /...
            const newPath = pathname.replace(/^\/cn/, '') || '/';
            router.push(newPath);
        }
    };

    const switchToChinese = () => {
        if (!isChineseRoute) {
            // Map /... to /cn/...
            const newPath = pathname === '/' ? '/cn' : `/cn${pathname}`;
            router.push(newPath);
        }
    };

    return (
        <div className="flex items-center gap-1 bg-white/80 backdrop-blur-sm rounded-full px-2 py-1 border border-gray-200 shadow-sm">
            <button
                onClick={switchToEnglish}
                className={`px-2 py-0.5 rounded-full text-sm font-medium transition-all ${!isChineseRoute
                        ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
            >
                EN
            </button>
            <span className="text-gray-300">|</span>
            <button
                onClick={switchToChinese}
                className={`px-2 py-0.5 rounded-full text-sm font-medium transition-all ${isChineseRoute
                        ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
            >
                中
            </button>
        </div>
    );
}

