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

export type VisualizationType =
    | 'StepFlow'
    | 'Timeline'
    | 'Funnel'
    | 'Cycle'
    | 'Matrix2x2'
    | 'DosDonts'
    | 'Spectrum'
    | 'BeforeAfter'
    | 'MindMap'
    | 'TreeDiagram'
    | 'Pyramid'
    | 'Onion'
    | 'Equation'
    | 'Checklist'
    | 'Scorecard'
    | 'CaseStudy';

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
    // Dynamic visualization
    visualizationType?: VisualizationType;
    visualizationData?: Record<string, any>;
    // Chinese translations (bilingual support)
    name_zh?: string;
    summary_zh?: string;
    principles_zh?: string[];
    problemItSolves_zh?: string;
    whenToUse_zh?: string;
    commonMistakes_zh?: string;
    realWorldExample_zh?: string;
    quote_zh?: string;
}

export const CATEGORY_INFO: Record<Category, { label: string; label_zh: string; emoji: string; gradient: string }> = {
    'product-strategy': { label: 'Product Strategy', label_zh: '产品战略', emoji: '🎯', gradient: 'from-brand-start to-brand-mid' },
    'growth-metrics': { label: 'Growth & Metrics', label_zh: '增长指标', emoji: '📈', gradient: 'from-primary-orange to-primary-gold' },
    'team-culture': { label: 'Team & Culture', label_zh: '团队文化', emoji: '👥', gradient: 'from-primary-purple to-primary-pink' },
    'user-research': { label: 'User Research', label_zh: '用户研究', emoji: '🔍', gradient: 'from-primary-blue to-primary-purple' },
    'execution': { label: 'Execution', label_zh: '执行落地', emoji: '⚡', gradient: 'from-primary-coral to-primary-orange' },
    'career-leadership': { label: 'Career & Leadership', label_zh: '职业领导力', emoji: '🚀', gradient: 'from-primary-lavender to-primary-pink' },
};
