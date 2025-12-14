
import React from 'react';
import { notFound } from 'next/navigation';
import { db } from '@/db';
import { drops } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { generateVibe, VibeConfig } from '@/lib/ai/service';
import { VibeRenderer } from '@/components/vibe/VibeRenderer';

export default async function DropPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;

    let config: VibeConfig;
    let dropId: number | undefined;

    // 1. Try to fetch from Database
    try {
        const dbDrops = await db.select().from(drops).where(eq(drops.slug, slug)).limit(1);

        if (dbDrops.length > 0 && dbDrops[0].generatedUiConfig) {
            // Found in DB! Use the stored config.
            config = dbDrops[0].generatedUiConfig as unknown as VibeConfig;
            dropId = dbDrops[0].id; // Use implicit number type from schema
            console.log(`[DropPage] Loaded config from DB for slug: ${slug}, ID: ${dropId}`);
        } else {
            // 2. Not found in DB? Fallback to "On-the-Fly" Generation (For Demo/Testing)
            // This allows us to test "vibes" without creating a full drop record first.
            console.log(`[DropPage] Drop not found in DB. generating on the fly for slug: ${slug}`);
            const rawParams = slug.split('-');
            const vibeInfo = rawParams[0];
            const productInfo = rawParams.slice(1).join(' ');

            config = await generateVibe(productInfo || 'Mystery Item', vibeInfo || 'Luxury');
        }
    } catch (error) {
        console.error("Database Error:", error);
        // Fallback to AI generation on DB error to keep the demo alive
        const rawParams = slug.split('-');
        config = await generateVibe(rawParams.slice(1).join(' ') || 'Error Item', rawParams[0]);
    }

    if (!config) {
        return notFound();
    }

    return (
        <main>
            <VibeRenderer config={config} dropId={dropId} />
        </main>
    );
}
