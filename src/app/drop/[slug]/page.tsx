
import React from 'react';
import { generateVibe } from '@/lib/ai/service';
import { VibeRenderer } from '@/components/vibe/VibeRenderer';

// In a real app, we would fetch the Drop based on params.slug, 
// get the stored Product/Vibe string, and potentially cache the generated config.
// For the prototype, we'll generate it on the fly or use mock data if API fails.

export default async function DropPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;

    // MOCK: parsing slug to simulate inputs
    // e.g., /drop/cyberpunk-hoodie -> Product: Hoodie, Vibe: Cyberpunk
    const rawParams = slug.split('-');
    const vibeInfo = rawParams[0]; // 'cyberpunk'
    const productInfo = rawParams.slice(1).join(' '); // 'hoodie'

    // Server-side call to AI service
    const config = await generateVibe(productInfo || 'Mystery Item', vibeInfo || 'Luxury');

    return (
        <main>
            <VibeRenderer config={config} />
        </main>
    );
}
