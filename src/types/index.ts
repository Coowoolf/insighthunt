// Type definitions for InsightHunt

export type Category =
    | 'product-strategy'
    | 'growth-metrics'
    | 'team-culture'
    | 'user-research'
    | 'execution'
    | 'career-leadership';

export interface Guest {
    id: string;
    name: string;
    slug: string;
    title: string;
    company: string;
    episodeNumber?: number;
    episodeDate?: string;
    youtubeUrl?: string;
    spotifyUrl?: string;
    keyTakeaways: string[];
    methodologies: Methodology[];
}

export interface Methodology {
    id: string;
    name: string;
    guestId: string;
    guestName: string;
    category: Category;
    tags: string[];
    summary: string;
    principles: string[];
    quote?: string;
    upvotes: number;
    // Deep dive fields
    problemItSolves?: string;
    whenToUse?: string;
    commonMistakes?: string;
    realWorldExample?: string;
    // Guest context
    guestBackground?: string;
    guestTitle?: string;
    guestCompany?: string;
    episodeSummary?: string;
}

export const CATEGORY_INFO: Record<Category, { label: string; emoji: string; gradient: string }> = {
    'product-strategy': { label: 'Product Strategy', emoji: '🎯', gradient: 'from-brand-start to-brand-mid' },
    'growth-metrics': { label: 'Growth & Metrics', emoji: '📈', gradient: 'from-primary-orange to-primary-gold' },
    'team-culture': { label: 'Team & Culture', emoji: '👥', gradient: 'from-primary-purple to-primary-pink' },
    'user-research': { label: 'User Research', emoji: '🔍', gradient: 'from-primary-blue to-primary-purple' },
    'execution': { label: 'Execution', emoji: '⚡', gradient: 'from-primary-coral to-primary-orange' },
    'career-leadership': { label: 'Career & Leadership', emoji: '🚀', gradient: 'from-primary-lavender to-primary-pink' },
};
