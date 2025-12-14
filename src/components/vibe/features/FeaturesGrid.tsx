
import React from 'react';
import { VibeConfig } from '@/lib/ai/service';

interface Props {
    theme: VibeConfig['theme'];
    features: VibeConfig['copy']['features'];
}

export function FeaturesGrid({ theme, features }: Props) {
    return (
        <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {features.map((feature, idx) => (
                    <div
                        key={idx}
                        className={`p-8 border ${theme.borderRadius} ${theme.colors.secondary} border-opacity-10 backdrop-blur-sm`}
                    >
                        <h3 className={`text-xl font-bold mb-3 ${theme.fonts.heading}`}>
                            {feature.title}
                        </h3>
                        <p className="opacity-70 leading-relaxed">
                            {feature.description}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
}
