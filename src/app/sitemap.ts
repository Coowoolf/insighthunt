import { MetadataRoute } from 'next';
import { getAllMethodologies, getAllGuests } from '@/data/insights';

const BASE_URL = 'https://insighthunt.org';

export default function sitemap(): MetadataRoute.Sitemap {
    const methodologies = getAllMethodologies();
    const guests = getAllGuests();

    // Static pages
    const staticPages: MetadataRoute.Sitemap = [
        {
            url: BASE_URL,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 1.0,
        },
        {
            url: `${BASE_URL}/cn`,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 1.0,
        },
        {
            url: `${BASE_URL}/methodologies`,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 0.9,
        },
        {
            url: `${BASE_URL}/cn/methodologies`,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 0.9,
        },
        {
            url: `${BASE_URL}/episodes`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.8,
        },
        {
            url: `${BASE_URL}/cn/episodes`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.8,
        },
        {
            url: `${BASE_URL}/skills`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.8,
        },
        {
            url: `${BASE_URL}/cn/skills`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.8,
        },
        {
            url: `${BASE_URL}/guests`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.7,
        },
        {
            url: `${BASE_URL}/cn/guests`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.7,
        },
    ];

    // Methodology pages (EN)
    const methodologyPagesEN: MetadataRoute.Sitemap = methodologies.map((m) => ({
        url: `${BASE_URL}/methodologies/${m.id}`,
        lastModified: new Date(),
        changeFrequency: 'monthly' as const,
        priority: 0.7,
    }));

    // Methodology pages (CN)
    const methodologyPagesCN: MetadataRoute.Sitemap = methodologies.map((m) => ({
        url: `${BASE_URL}/cn/methodologies/${m.id}`,
        lastModified: new Date(),
        changeFrequency: 'monthly' as const,
        priority: 0.7,
    }));

    // Episode pages (EN)
    const episodePagesEN: MetadataRoute.Sitemap = guests.map((g) => ({
        url: `${BASE_URL}/episodes/${g.slug}`,
        lastModified: new Date(),
        changeFrequency: 'monthly' as const,
        priority: 0.6,
    }));

    // Episode pages (CN)
    const episodePagesCN: MetadataRoute.Sitemap = guests.map((g) => ({
        url: `${BASE_URL}/cn/episodes/${g.slug}`,
        lastModified: new Date(),
        changeFrequency: 'monthly' as const,
        priority: 0.6,
    }));

    return [
        ...staticPages,
        ...methodologyPagesEN,
        ...methodologyPagesCN,
        ...episodePagesEN,
        ...episodePagesCN,
    ];
}
