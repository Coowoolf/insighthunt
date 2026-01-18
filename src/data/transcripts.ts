// Transcript data utilities
import fs from 'fs';
import path from 'path';

export interface Transcript {
    guest: string;
    en: string;
    zh?: string;
    chunks_count?: number;
}

export function getTranscriptByGuestName(guestName: string): Transcript | null {
    try {
        const transcriptsDir = path.join(process.cwd(), 'data', 'transcripts');
        const filePath = path.join(transcriptsDir, `${guestName}.json`);

        if (!fs.existsSync(filePath)) {
            return null;
        }

        const content = fs.readFileSync(filePath, 'utf-8');
        return JSON.parse(content) as Transcript;
    } catch (error) {
        console.error(`Error loading transcript for ${guestName}:`, error);
        return null;
    }
}

export function getAllTranscriptGuestNames(): string[] {
    try {
        const transcriptsDir = path.join(process.cwd(), 'data', 'transcripts');
        const files = fs.readdirSync(transcriptsDir);
        return files
            .filter(f => f.endsWith('.json') && !f.includes('log'))
            .map(f => f.replace('.json', ''));
    } catch (error) {
        console.error('Error listing transcripts:', error);
        return [];
    }
}
