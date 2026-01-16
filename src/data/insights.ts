// InsightHunt Data Layer - Real extracted data from Gemini 3 Pro High
// This file loads data from the extracted JSON files

import { Methodology, Guest, Category } from '@/types';

// Import the sample data (in production, this would be all 297 episodes)
import sampleData from '../../data/extracted/sample_data.json';

// Transform the extracted data into our app format
function transformData() {
    const guests: Guest[] = [];
    const methodologies: Methodology[] = [];
    let methodologyId = 1;

    sampleData.forEach((episode: any, episodeIndex: number) => {
        const guestSlug = episode.filename.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');

        // Create guest entry
        const guest: Guest = {
            id: guestSlug,
            name: episode.guest.name,
            slug: guestSlug,
            title: episode.guest.title,
            company: episode.guest.company,
            episodeNumber: episodeIndex + 1,
            keyTakeaways: episode.keyTakeaways || [],
            methodologies: [],
        };

        // Create methodology entries
        episode.methodologies?.forEach((m: any, mIndex: number) => {
            const methodology: Methodology = {
                id: `m-${methodologyId++}`,
                name: m.name,
                guestId: guestSlug,
                guestName: episode.guest.name,
                category: validateCategory(m.category),
                tags: generateTags(m.name, m.category),
                summary: m.summary,
                principles: m.principles || [],
                quote: m.quote,
                upvotes: Math.floor(Math.random() * 150) + 50,
                // Deep dive fields
                problemItSolves: m.problemItSolves,
                whenToUse: m.whenToUse,
                commonMistakes: m.commonMistakes,
                realWorldExample: m.realWorldExample,
                // Guest context
                guestBackground: episode.guest.background,
                guestTitle: episode.guest.title,
                guestCompany: episode.guest.company,
                episodeSummary: episode.episodeSummary,
                // Dynamic visualization
                visualizationType: m.visualizationType,
                visualizationData: m.visualizationData,
            };
            methodologies.push(methodology);
            guest.methodologies.push(methodology);
        });

        guests.push(guest);
    });

    return { guests, methodologies };
}

function validateCategory(category: string): Category {
    const validCategories: Category[] = [
        'product-strategy',
        'growth-metrics',
        'team-culture',
        'user-research',
        'execution',
        'career-leadership',
    ];

    if (validCategories.includes(category as Category)) {
        return category as Category;
    }
    return 'product-strategy'; // Default
}

function generateTags(name: string, category: string): string[] {
    const tags: string[] = [];

    // Extract key words from name
    const words = name.toLowerCase().split(/\s+/);
    words.forEach(word => {
        if (word.length > 4 && !['framework', 'strategy', 'model', 'system'].includes(word)) {
            tags.push(word);
        }
    });

    // Add category-based tags
    const categoryTags: Record<string, string[]> = {
        'product-strategy': ['strategy', 'product'],
        'growth-metrics': ['growth', 'metrics', 'data'],
        'team-culture': ['team', 'culture', 'leadership'],
        'user-research': ['research', 'users', 'discovery'],
        'execution': ['execution', 'process', 'delivery'],
        'career-leadership': ['career', 'leadership', 'growth'],
    };

    if (categoryTags[category]) {
        tags.push(...categoryTags[category].slice(0, 2));
    }

    return [...new Set(tags)].slice(0, 5);
}

// Initialize data
const { guests, methodologies } = transformData();

// Export functions
export function getAllMethodologies(): Methodology[] {
    return methodologies;
}

export function getMethodologyById(id: string): Methodology | undefined {
    return methodologies.find(m => m.id === id);
}

export function getGuestBySlug(slug: string): Guest | undefined {
    return guests.find(g => g.slug === slug);
}

export function getAllGuests(): Guest[] {
    return guests;
}

export function getMethodologiesByCategory(category: Category): Methodology[] {
    return methodologies.filter(m => m.category === category);
}

export function searchMethodologies(query: string): Methodology[] {
    const q = query.toLowerCase();
    return methodologies.filter(m =>
        m.name.toLowerCase().includes(q) ||
        m.summary.toLowerCase().includes(q) ||
        m.guestName.toLowerCase().includes(q) ||
        m.principles.some(p => p.toLowerCase().includes(q))
    );
}

// Stats
export function getStats() {
    return {
        totalGuests: guests.length,
        totalMethodologies: methodologies.length,
        totalEpisodes: 297, // Full archive count
        categories: {
            'product-strategy': methodologies.filter(m => m.category === 'product-strategy').length,
            'growth-metrics': methodologies.filter(m => m.category === 'growth-metrics').length,
            'team-culture': methodologies.filter(m => m.category === 'team-culture').length,
            'user-research': methodologies.filter(m => m.category === 'user-research').length,
            'execution': methodologies.filter(m => m.category === 'execution').length,
            'career-leadership': methodologies.filter(m => m.category === 'career-leadership').length,
        }
    };
}

export { guests, methodologies };
