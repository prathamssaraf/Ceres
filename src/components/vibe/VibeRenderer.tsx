
'use client';

import React from 'react';
import { VibeConfig } from '@/lib/ai/service';
import { HeroCentered } from './hero/HeroCentered';
import { FeaturesGrid } from './features/FeaturesGrid';
// import { GalleryGrid } from './gallery/GalleryGrid'; // TODO: Implement

interface VibeRendererProps {
    config: VibeConfig;
}

export function VibeRenderer({ config }: VibeRendererProps) {
    const { theme, copy, components } = config;

    // Apply theme-level styles (colors, fonts) to a root wrapper or via context
    // For simplicity, we'll inline some standard mapping here or pass them down

    return (
        <div className={`min-h-screen ${theme.colors.background} ${theme.colors.text} ${theme.fonts.body}`}>
            {/* 1. Hero Section */}
            <section>
                {components.hero.type === 'hero-centered' && (
                    <HeroCentered theme={theme} copy={copy} />
                )}
                {/* Add cases for other hero types */}
            </section>

            {/* 2. Features Section */}
            <section className="py-20">
                {components.features.type === 'grid-3' && (
                    <FeaturesGrid theme={theme} features={copy.features} />
                )}
            </section>

            {/* 3. CTA / Footer */}
            <footer className={`py-12 text-center ${theme.colors.secondary}`}>
                <h2 className={`text-3xl font-bold mb-4 ${theme.fonts.heading}`}>{copy.cta}</h2>
                <button className={`px-8 py-3 font-bold transition-transform hover:scale-105 ${theme.colors.accent} text-white ${theme.borderRadius}`}>
                    Buy Now
                </button>
            </footer>
        </div>
    );
}
