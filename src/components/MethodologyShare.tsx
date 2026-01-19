'use client';

import { ShareButtons } from '@/components/ShareButtons';

interface MethodologyShareProps {
    id: string;
    name: string;
    summary?: string;
}

export function MethodologyShare({ id, name, summary }: MethodologyShareProps) {
    const url = typeof window !== 'undefined'
        ? `${window.location.origin}/methodologies/${id}`
        : `https://insighthunt.org/methodologies/${id}`;

    return (
        <ShareButtons
            url={url}
            title={`${name} | InsightHunt`}
            description={summary}
        />
    );
}
