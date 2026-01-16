import type { Config } from 'tailwindcss';

const config: Config = {
    content: [
        './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
        './src/components/**/*.{js,ts,jsx,tsx,mdx}',
        './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
        extend: {
            colors: {
                // Dopamine Geek Style Premium Colors
                cream: '#FAF8F5',
                dark: '#0C0C10',
                // Primary gradient stops
                primary: {
                    blue: '#5B9FFF',
                    purple: '#7B68EE',
                    lavender: '#A78BFA',
                    pink: '#E879F9',
                    coral: '#F472B6',
                    orange: '#FB923C',
                    gold: '#FBBF24',
                },
                // Brand gradient
                brand: {
                    start: '#6366f1',
                    mid: '#a855f7',
                    end: '#ec4899',
                },
            },
            fontFamily: {
                outfit: ['Outfit', 'system-ui', 'sans-serif'],
            },
            borderRadius: {
                'clay': '20px',
                'clay-lg': '28px',
            },
            boxShadow: {
                'clay': '0 8px 32px rgba(99, 102, 241, 0.15), 0 4px 16px rgba(168, 85, 247, 0.1)',
                'clay-hover': '0 12px 48px rgba(99, 102, 241, 0.25), 0 8px 24px rgba(168, 85, 247, 0.15)',
                'glow': '0 0 40px rgba(99, 102, 241, 0.3)',
            },
            backgroundImage: {
                'gradient-brand': 'linear-gradient(135deg, #6366f1 0%, #a855f7 50%, #ec4899 100%)',
                'gradient-orange': 'linear-gradient(135deg, #FB923C 0%, #FBBF24 100%)',
                'gradient-purple': 'linear-gradient(135deg, #A78BFA 0%, #E879F9 100%)',
                'gradient-blue': 'linear-gradient(135deg, #5B9FFF 0%, #7B68EE 100%)',
            },
        },
    },
    plugins: [],
};

export default config;
