declare module "flowglad" {
  export class Flowglad {
    constructor(config: { apiKey: string });
    products: {
      create(data: { name: string; price: number; metadata?: any }): Promise<any>;
    };
    checkouts: {
      create(data: { productId: string; successUrl: string; cancelUrl: string }): Promise<any>;
    };
  }
}
