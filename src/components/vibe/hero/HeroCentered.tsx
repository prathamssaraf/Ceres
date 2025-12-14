
'use client';

import React, { useState } from 'react';
import { VibeConfig } from '@/lib/ai/service';
import { generateCheckoutLink } from '@/app/actions/drops';
import Image from 'next/image';
import { ShoppingCart, Package, CheckCircle2 } from 'lucide-react';

interface Props {
    theme: VibeConfig['theme'];
    copy: VibeConfig['copy'];
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

export function HeroCentered({ theme, copy, dropId, productData }: Props) {
    const [loading, setLoading] = useState(false);
    const [quantity, setQuantity] = useState(1);

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

    const formatPrice = (cents: number) => {
        return `$${(cents / 100).toFixed(2)}`;
    };

    const isAvailable = productData && productData.status === 'active' && productData.inventoryCount > 0;

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
            <div className="container mx-auto px-4 py-12 md:py-20">
                <div className="grid md:grid-cols-2 gap-12 items-center max-w-7xl mx-auto">
                    {/* Product Image */}
                    <div className="relative group">
                        <div className="absolute -inset-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl opacity-20 group-hover:opacity-30 blur-2xl transition-opacity duration-500"></div>
                        <div className="relative bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-200">
                            {productData?.imageUrl ? (
                                <div className="aspect-square relative">
                                    <Image
                                        src={productData.imageUrl}
                                        alt={productData.name}
                                        fill
                                        className="object-cover"
                                        priority
                                    />
                                </div>
                            ) : (
                                <div className="aspect-square bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                                    <Package className="w-24 h-24 text-gray-400" />
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Product Info */}
                    <div className="space-y-8">
                        <div>
                            <h1 className="text-5xl md:text-7xl font-black mb-4 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent leading-tight">
                                {copy.headline}
                            </h1>
                            <p className="text-xl md:text-2xl text-gray-600 leading-relaxed">
                                {copy.subheadline}
                            </p>
                        </div>

                        {productData?.description && (
                            <p className="text-lg text-gray-700 leading-relaxed border-l-4 border-blue-500 pl-4">
                                {productData.description}
                            </p>
                        )}

                        {/* Price */}
                        {productData && (
                            <div className="flex items-baseline gap-4">
                                <span className="text-5xl font-bold text-gray-900">
                                    {formatPrice(productData.price)}
                                </span>
                                <span className="text-lg text-gray-500">per unit</span>
                            </div>
                        )}

                        {/* Inventory Status */}
                        {productData && (
                            <div className="flex items-center gap-2">
                                {isAvailable ? (
                                    <>
                                        <CheckCircle2 className="w-5 h-5 text-green-600" />
                                        <span className="text-green-700 font-medium">
                                            {productData.inventoryCount} in stock
                                        </span>
                                    </>
                                ) : (
                                    <span className="text-red-600 font-medium">Out of stock</span>
                                )}
                            </div>
                        )}

                        {/* Quantity Selector */}
                        {isAvailable && (
                            <div className="flex items-center gap-4">
                                <span className="text-gray-700 font-medium">Quantity:</span>
                                <div className="flex items-center border-2 border-gray-300 rounded-lg overflow-hidden">
                                    <button
                                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                        className="px-4 py-2 bg-gray-100 hover:bg-gray-200 transition-colors font-bold text-gray-700"
                                    >
                                        -
                                    </button>
                                    <span className="px-6 py-2 font-bold text-gray-900">{quantity}</span>
                                    <button
                                        onClick={() => setQuantity(Math.min(productData.inventoryCount, quantity + 1))}
                                        className="px-4 py-2 bg-gray-100 hover:bg-gray-200 transition-colors font-bold text-gray-700"
                                    >
                                        +
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* CTA Button */}
                        <div className="space-y-4">
                            <button
                                onClick={handleBuy}
                                disabled={loading || !isAvailable}
                                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold text-lg px-8 py-5 rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 group"
                            >
                                <ShoppingCart className="w-6 h-6 group-hover:scale-110 transition-transform" />
                                {loading ? 'Redirecting...' : isAvailable ? copy.cta : 'Out of Stock'}
                            </button>

                            {copy.socialProof && (
                                <p className="text-center text-sm uppercase tracking-widest text-gray-500">
                                    {copy.socialProof}
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
