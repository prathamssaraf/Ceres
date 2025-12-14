
import React from 'react';
import { notFound } from 'next/navigation';
import { db } from '@/db';
import { drops } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { generateVibe, VibeConfig } from '@/lib/ai/service';
import { VibeRenderer } from '@/components/vibe/VibeRenderer';

export default async function DropPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;

    let config: VibeConfig | null = null;
    let dropId: number | undefined;
    let productData: any = null;
    let customHtml: string | null = null;

    // 1. Try to fetch from Database
    try {
        const dbDrops = await db.select().from(drops).where(eq(drops.slug, slug)).limit(1);

        if (dbDrops.length > 0) {
            dropId = dbDrops[0].id;
            customHtml = dbDrops[0].customHtml;
            productData = {
                name: dbDrops[0].name,
                description: dbDrops[0].description,
                price: dbDrops[0].price,
                inventoryCount: dbDrops[0].inventoryCount,
                imageUrl: dbDrops[0].imageUrl,
                status: dbDrops[0].status,
            };

            // If we have custom HTML, use it
            if (customHtml) {
                console.log(`[DropPage] Using custom HTML for slug: ${slug}, ID: ${dropId}`);
            } else if (dbDrops[0].generatedUiConfig) {
                // Fallback to the old VibeRenderer if no custom HTML
                config = dbDrops[0].generatedUiConfig as unknown as VibeConfig;
                console.log(`[DropPage] Using VibeRenderer for slug: ${slug}, ID: ${dropId}`);
            }
        } else {
            // 2. Not found in DB? Fallback to "On-the-Fly" Generation (For Demo/Testing)
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

    // If we have custom HTML, render it directly
    if (customHtml) {
        return (
            <main>
                <div dangerouslySetInnerHTML={{ __html: customHtml }} />
            </main>
        );
    }

    // Otherwise, use the VibeRenderer
    if (!config) {
        return notFound();
    }

    return (
        <main>
            <VibeRenderer config={config} dropId={dropId} productData={productData} />
        </main>
    );
}
