
'use client';

import React, { useState } from 'react';
import { VibeConfig } from '@/lib/ai/service';
import { generateCheckoutLink } from '@/app/actions/drops';

interface Props {
    theme: VibeConfig['theme'];
    copy: VibeConfig['copy'];
    imagePrompt?: string;
    dropId?: number;
}

export function HeroSplit({ theme, copy, imagePrompt, dropId }: Props) {
    const [loading, setLoading] = useState(false);

    const handleBuy = async () => {
        if (!dropId) {
            alert("Demo Mode: Checkout is disabled until this drop is saved to the database.");
            return;
        }

        try {
            setLoading(true);
            const { url } = await generateCheckoutLink(dropId);
            if (url) {
                window.location.href = url;
            }
        } catch (error) {
            console.error("Checkout validation failed", error);
            alert("Unable to start checkout. Ensure the drop is Active and Flowglad is connected.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={`flex flex-col md:flex-row items-center justify-between min-h-[80vh] px-4 md:px-12 py-12 gap-12 overflow-hidden`}>
            {/* Content Side */}
            <div className="flex-1 text-left space-y-8">
                <h1 className={`text-5xl md:text-7xl font-bold leading-tight ${theme.fonts.heading}`}>
                    {copy.headline}
                </h1>
                <p className={`text-lg md:text-xl opacity-80 max-w-xl ${theme.fonts.body}`}>
                    {copy.subheadline}
                </p>
                <div className="flex flex-wrap gap-4">
                    {/* Primary CTA */}
                    <button
                        onClick={handleBuy}
                        disabled={loading}
                        className={`px-8 py-4 text-lg font-bold shadow-lg transition-transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed ${theme.colors.accent} text-white ${theme.borderRadius}`}
                    >
                        {loading ? 'Processing...' : copy.cta}
                    </button>

                    {/* Secondary/Social Proof */}
                    {copy.socialProof && (
                        <div className={`px-6 py-4 flex items-center border ${theme.borderRadius} border-current opacity-60 text-sm font-semibold`}>
                            {copy.socialProof}
                        </div>
                    )}
                </div>
            </div>

            {/* Visual Side */}
            <div className="flex-1 w-full h-[500px] relative">
                <div className={`w-full h-full ${theme.borderRadius} overflow-hidden bg-gray-200 relative group`}>
                    {/* Placeholder for AI generated image or product image */}
                    <div className="absolute inset-0 bg-gradient-to-br from-gray-300 to-gray-400 animate-pulse flex items-center justify-center text-gray-500">
                        <span>[Product Image: {imagePrompt || 'Hero'}]</span>
                    </div>
                    {/* Decorative element from theme */}
                    <div className={`absolute -bottom-10 -right-10 w-40 h-40 ${theme.colors.secondary} opacity-50 rounded-full blur-3xl`} />
                </div>
            </div>
        </div>
    );
}
