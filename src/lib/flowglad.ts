// Mock Flowglad SDK for hackathon demo
// In production, this would use the real Flowglad API

class MockFlowglad {
  constructor(config: { apiKey: string }) {
    // Mock initialization
  }

  products = {
    create: async (data: { name: string; price: number; metadata: any }) => {
      // Mock product creation - returns a mock product ID
      return {
        id: `prod_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        name: data.name,
        price: data.price,
        metadata: data.metadata,
      };
    },
  };

  checkouts = {
    create: async (data: { productId: string; successUrl: string; cancelUrl: string }) => {
      // Mock checkout session - returns a localhost checkout URL for demo
      const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
      return {
        id: `checkout_${Date.now()}`,
        url: `${baseUrl}/checkout/${data.productId}`,
        productId: data.productId,
        successUrl: data.successUrl,
        cancelUrl: data.cancelUrl,
      };
    },
  };
}

const flowglad = new MockFlowglad({
  apiKey: process.env.FLOWGLAD_API_KEY || "mock_api_key",
});

export async function createFlowgladProduct(data: {
  name: string;
  price: number; // in cents
  slug: string;
}) {
  return await flowglad.products.create({
    name: data.name,
    price: data.price,
    metadata: {
      slug: data.slug,
    },
  });
}

export async function createCheckoutSession(productId: string, successUrl: string) {
  return await flowglad.checkouts.create({
    productId,
    successUrl,
    cancelUrl: successUrl.replace("success", "cancel"),
  });
}
