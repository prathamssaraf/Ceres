
'use client';

import React, { useState } from 'react';
import { VibeConfig } from '@/lib/ai/service';
import { generateCheckoutLink } from '@/app/actions/drops';

interface Props {
    theme: VibeConfig['theme'];
    copy: VibeConfig['copy'];
    dropId?: number;
}

export function HeroCentered({ theme, copy, dropId }: Props) {
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
        <div className="flex flex-col items-center justify-center min-h-[80vh] px-4 text-center">
            <h1 className={`text-6xl md:text-8xl font-black mb-6 tracking-tighter ${theme.fonts.heading}`}>
                {copy.headline}
            </h1>
            <p className="text-xl md:text-2xl opacity-80 max-w-2xl mb-10">
                {copy.subheadline}
            </p>
            <button
                onClick={handleBuy}
                disabled={loading}
                className={`px-8 py-4 text-lg font-bold shadow-lg transition-transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed ${theme.colors.accent} text-white ${theme.borderRadius}`}
            >
                {loading ? 'Redirecting...' : copy.cta}
            </button>

            {copy.socialProof && (
                <p className="mt-8 text-sm uppercase tracking-widest opacity-60">
                    {copy.socialProof}
                </p>
            )}
        </div>
    );
}
