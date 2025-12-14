
import React from 'react';
import { VibeConfig } from '@/lib/ai/service';

interface Props {
    theme: VibeConfig['theme'];
    copy: VibeConfig['copy'];
}

export function HeroCentered({ theme, copy }: Props) {
    return (
        <div className="flex flex-col items-center justify-center min-h-[80vh] px-4 text-center">
            <h1 className={`text-6xl md:text-8xl font-black mb-6 tracking-tighter ${theme.fonts.heading}`}>
                {copy.headline}
            </h1>
            <p className="text-xl md:text-2xl opacity-80 max-w-2xl mb-10">
                {copy.subheadline}
            </p>
            <button
                className={`px-8 py-4 text-lg font-bold shadow-lg transition-transform hover:scale-105 active:scale-95 ${theme.colors.accent} text-white ${theme.borderRadius}`}
            >
                {copy.cta}
            </button>

            {copy.socialProof && (
                <p className="mt-8 text-sm uppercase tracking-widest opacity-60">
                    {copy.socialProof}
                </p>
            )}
        </div>
    );
}
