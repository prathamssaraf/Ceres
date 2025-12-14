'use client';

import React from 'react';
import { VibeConfig } from '@/lib/ai/service';
import { HeroCentered } from './hero/HeroCentered';
import { HeroSplit } from './hero/HeroSplit';
import { FeaturesGrid } from './features/FeaturesGrid';
// import { GalleryGrid } from './gallery/GalleryGrid'; // TODO: Implement

interface VibeRendererProps {
    config: VibeConfig;
    dropId?: number;
    productData?: {
        name: string;
        description: string | null;
        price: number;
        inventoryCount: number;
        imageUrl: string | null;
        status: string | null;
    } | null;
}

export function VibeRenderer({ config, dropId, productData }: VibeRendererProps) {
    const { theme, copy, components } = config;

    return (
        <div className={`min-h-screen ${theme.colors.background} ${theme.colors.text} ${theme.fonts.body}`}>
            {/* 1. Hero Section */}
            <section>
                {components.hero.type === 'hero-centered' && (
                    <HeroCentered theme={theme} copy={copy} dropId={dropId} productData={productData} />
                )}
                {components.hero.type === 'hero-split' && (
                    <HeroSplit theme={theme} copy={copy} imagePrompt={components.hero.imagePrompt} dropId={dropId} />
                )}
                {/* Fallback if type match fails? Default to Centered */}
                {!['hero-centered', 'hero-split'].includes(components.hero.type) && (
                    <HeroCentered theme={theme} copy={copy} dropId={dropId} productData={productData} />
                )}
            </section>

            {/* 2. Features Section */}
            {copy.features && copy.features.length > 0 && (
                <section className="py-20">
                    {components.features.type === 'grid-3' && (
                        <FeaturesGrid theme={theme} features={copy.features} />
                    )}
                </section>
            )}
        </div>
    );
}
