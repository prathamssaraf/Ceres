"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, CreditCard, Lock } from "lucide-react";

export default function CheckoutPage({
  params
}: {
  params: Promise<{ productId: string }>
}) {
  const [productId, setProductId] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    params.then(p => setProductId(p.productId));
  }, [params]);

  const handlePayment = () => {
    setIsProcessing(true);

    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false);
      setIsSuccess(true);

      // Redirect to success page after 2 seconds
      setTimeout(() => {
        window.location.href = "/admin/dashboard";
      }, 2000);
    }, 2000);
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-neutral-950 via-neutral-900 to-neutral-950 flex items-center justify-center p-6">
        <Card className="bg-neutral-900/50 border-neutral-800 max-w-md w-full">
          <CardContent className="p-12 text-center">
            <div className="flex justify-center mb-6">
              <div className="h-20 w-20 rounded-full bg-green-500/20 flex items-center justify-center">
                <CheckCircle2 className="h-10 w-10 text-green-500" />
              </div>
            </div>
            <h2 className="text-2xl font-semibold text-white mb-2">
              Payment Successful!
            </h2>
            <p className="text-neutral-400 mb-4">
              Your order has been confirmed.
            </p>
            <p className="text-sm text-neutral-500">
              Redirecting to dashboard...
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-950 via-neutral-900 to-neutral-950 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Checkout</h1>
          <p className="text-neutral-400">Complete your purchase</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Checkout Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Payment Information */}
            <Card className="bg-neutral-900/50 border-neutral-800">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Payment Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm text-neutral-400 mb-2 block">
                    Card Number
                  </label>
                  <input
                    type="text"
                    placeholder="4242 4242 4242 4242"
                    className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-3 text-white placeholder:text-neutral-500"
                    disabled={isProcessing}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-neutral-400 mb-2 block">
                      Expiry Date
                    </label>
                    <input
                      type="text"
                      placeholder="MM/YY"
                      className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-3 text-white placeholder:text-neutral-500"
                      disabled={isProcessing}
                    />
                  </div>
                  <div>
                    <label className="text-sm text-neutral-400 mb-2 block">
                      CVC
                    </label>
                    <input
                      type="text"
                      placeholder="123"
                      className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-3 text-white placeholder:text-neutral-500"
                      disabled={isProcessing}
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm text-neutral-400 mb-2 block">
                    Cardholder Name
                  </label>
                  <input
                    type="text"
                    placeholder="John Doe"
                    className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-3 text-white placeholder:text-neutral-500"
                    disabled={isProcessing}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Billing Address */}
            <Card className="bg-neutral-900/50 border-neutral-800">
              <CardHeader>
                <CardTitle className="text-white">Billing Address</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm text-neutral-400 mb-2 block">
                    Email
                  </label>
                  <input
                    type="email"
                    placeholder="john@example.com"
                    className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-3 text-white placeholder:text-neutral-500"
                    disabled={isProcessing}
                  />
                </div>

                <div>
                  <label className="text-sm text-neutral-400 mb-2 block">
                    Address
                  </label>
                  <input
                    type="text"
                    placeholder="123 Main St"
                    className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-3 text-white placeholder:text-neutral-500"
                    disabled={isProcessing}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-neutral-400 mb-2 block">
                      City
                    </label>
                    <input
                      type="text"
                      placeholder="San Francisco"
                      className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-3 text-white placeholder:text-neutral-500"
                      disabled={isProcessing}
                    />
                  </div>
                  <div>
                    <label className="text-sm text-neutral-400 mb-2 block">
                      Postal Code
                    </label>
                    <input
                      type="text"
                      placeholder="94102"
                      className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-3 text-white placeholder:text-neutral-500"
                      disabled={isProcessing}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="bg-neutral-900/50 border-neutral-800 sticky top-6">
              <CardHeader>
                <CardTitle className="text-white">Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-neutral-400">Product ID</span>
                    <span className="text-white font-mono text-xs">
                      {productId.slice(0, 20)}...
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-neutral-400">Subtotal</span>
                    <span className="text-white">Coming soon</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-neutral-400">Shipping</span>
                    <span className="text-green-400">Free</span>
                  </div>
                </div>

                <div className="border-t border-neutral-800 pt-4">
                  <div className="flex justify-between mb-4">
                    <span className="text-white font-semibold">Total</span>
                    <span className="text-white font-semibold">Demo Mode</span>
                  </div>

                  <Button
                    onClick={handlePayment}
                    disabled={isProcessing}
                    className="w-full bg-white text-black hover:bg-neutral-200"
                    size="lg"
                  >
                    {isProcessing ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-black border-t-transparent mr-2" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <Lock className="mr-2 h-4 w-4" />
                        Complete Purchase
                      </>
                    )}
                  </Button>
                </div>

                <p className="text-xs text-neutral-500 text-center">
                  🎭 Demo Mode - No real payment will be processed
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
