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

        // Strategy 1: Direct match with guest name
        let filePath = path.join(transcriptsDir, `${guestName}.json`);
        if (fs.existsSync(filePath)) {
            const content = fs.readFileSync(filePath, 'utf-8');
            return JSON.parse(content) as Transcript;
        }

        // Strategy 2: Try to find by searching all transcripts for matching guest field
        const files = fs.readdirSync(transcriptsDir);
        for (const file of files) {
            if (!file.endsWith('.json') || file.includes('log')) continue;
            const fullPath = path.join(transcriptsDir, file);
            try {
                const content = fs.readFileSync(fullPath, 'utf-8');
                const transcript = JSON.parse(content) as Transcript;
                // Match if guest field contains either name or first word matches
                const guestNameLower = guestName.toLowerCase();
                const transcriptGuestLower = transcript.guest?.toLowerCase() || '';
                const fileNameWithoutExt = file.replace('.json', '').toLowerCase();

                if (transcriptGuestLower === guestNameLower ||
                    guestNameLower.includes(transcriptGuestLower) ||
                    transcriptGuestLower.includes(guestNameLower.split(' ')[0])) {
                    return transcript;
                }
                // Special case: file name contains both parts of a multi-guest name
                const nameParts = guestNameLower.split(/[&,]/).map(p => p.trim().split(' ')[0]);
                if (nameParts.length > 1 && nameParts.every(p => fileNameWithoutExt.includes(p))) {
                    return transcript;
                }
            } catch {
                continue;
            }
        }

        return null;
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
