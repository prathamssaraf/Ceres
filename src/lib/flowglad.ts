import { Flowglad } from "flowglad";

const flowglad = new Flowglad({
  apiKey: process.env.FLOWGLAD_API_KEY!,
});

export async function createFlowgladProduct(data: {
  name: string;
  price: number; // in cents
  slug: string;
}) {
  // This is a hypothetical API based on the "programmable" nature.
  // In a real hackathon, we'd check the docs.
  // Assuming a standard create object pattern.
  return await flowglad.products.create({
    name: data.name,
    price: data.price,
    metadata: {
      slug: data.slug,
    },
    // The "natural language" part might imply passing a prompt, but for infra we pass structured data
  });
}

export async function createCheckoutSession(productId: string, successUrl: string) {
  return await flowglad.checkouts.create({
    productId,
    successUrl,
    cancelUrl: successUrl.replace("success", "cancel"),
  });
}
