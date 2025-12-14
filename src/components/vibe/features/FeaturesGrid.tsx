
import React from 'react';
import { VibeConfig } from '@/lib/ai/service';
import { Sparkles, Shield, Zap } from 'lucide-react';

interface Props {
    theme: VibeConfig['theme'];
    features: VibeConfig['copy']['features'];
}

const iconMap = [Sparkles, Shield, Zap];

export function FeaturesGrid({ theme, features }: Props) {
    return (
        <div className="bg-gradient-to-br from-gray-50 via-white to-gray-100 py-20">
            <div className="container mx-auto px-4">
                <h2 className="text-4xl md:text-5xl font-black text-center mb-16 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent">
                    Why Choose Us
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                    {features.map((feature, idx) => {
                        const Icon = iconMap[idx % iconMap.length];
                        return (
                            <div
                                key={idx}
                                className="group relative bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-200 hover:border-blue-300 hover:-translate-y-2"
                            >
                                <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl opacity-0 group-hover:opacity-20 blur transition-opacity duration-300"></div>
                                <div className="relative">
                                    <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                                        <Icon className="w-7 h-7 text-white" />
                                    </div>
                                    <h3 className="text-2xl font-bold mb-4 text-gray-900">
                                        {feature.title}
                                    </h3>
                                    <p className="text-gray-600 leading-relaxed">
                                        {feature.description}
                                    </p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
