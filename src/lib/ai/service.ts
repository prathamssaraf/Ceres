
import Anthropic from '@anthropic-ai/sdk';

// Initialize Anthropic client
// Ensure ANTHROPIC_API_KEY is set in your .env.local file
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export interface VibeConfig {
  theme: {
    name: string;
    description: string;
    colors: {
      primary: string; // Tailwind class or hex
      secondary: string;
      background: string;
      text: string;
      accent: string;
    };
    fonts: {
      heading: string; // e.g., 'font-sans' or generic family
      body: string;
    };
    borderRadius: string; // e.g., 'rounded-none', 'rounded-xl'
  };
  copy: {
    headline: string;
    subheadline: string;
    cta: string;
    features: {
      title: string;
      description: string;
    }[];
    socialProof: string; // e.g. "Trusted by 500+ nomads"
  };
  components: {
    hero: {
      type: 'hero-centered' | 'hero-split' | 'hero-image-bg';
      imagePrompt?: string; // Optional prompt for image generation
    };
    features: {
      type: 'grid-3' | 'list-alternating' | 'cards-minimal';
    };
    gallery: {
      type: 'carousel' | 'masonry' | 'grid';
    };
  };
}

export async function generateVibe(product: string, vibe?: string): Promise<VibeConfig> {
  const userPrompt = vibe 
    ? `Product: ${product}\nDesired Vibe: ${vibe}`
    : `Product: ${product}\nDesired Vibe: Auto-detect based on product`;

  const systemPrompt = `
    You are an expert Creative Director and UI Designer. Your goal is to generate a JSON configuration for a high-converting, aesthetically stunning landing page for a specific product drop.
    
    You will receive a Product description and a Vibe.
    1. Analyze the product and vibe to determine the best visual style (typography, colors, layout).
    2. Generate creative marketing copy that matches the tone (e.g., "Hype", "Luxury", "Minimalist").
    3. Return a valid JSON object matching the VibeConfig interface.
    
    RULES:
    - Use Tailwind CSS utility classes where appropriate for sizing/spacing, but specific hex codes for colors are allowed if standard Tailwind palettes don't fit.
    - BE CREATIVE! If the vibe is "Cyberpunk", use neon colors and sharp edges. If "Cottagecore", use soft pastels and rounded corners.
    - For fonts, suggest standard Tailwind font families ('font-sans', 'font-serif', 'font-mono') or standard web fonts.
    - Ensure the JSON is strictly valid. Do not include markdown code block syntax around the JSON.
  `;

  try {
    const message = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 2048,
      temperature: 0.7,
      system: systemPrompt,
      messages: [
        { role: 'user', content: userPrompt }
      ],
    });

    // Extract JSON from response (handling potential extra text)
    const content = message.content[0].type === 'text' ? message.content[0].text : '';
    // Basic cleanup to ensure we just get the JSON
    const jsonString = content.replace(/```json/g, '').replace(/```/g, '').trim();
    
    return JSON.parse(jsonString) as VibeConfig;

  } catch (error) {
    console.error('Error generating vibe:', error);
    // Fallback/Mock response for development or error cases
    return {
      theme: {
        name: 'Default Fallback',
        description: 'Clean and minimal fallback theme',
        colors: {
          primary: 'bg-black',
          secondary: 'bg-gray-800',
          background: 'bg-white',
          text: 'text-gray-900',
          accent: 'text-blue-600'
        },
        fonts: { heading: 'font-sans', body: 'font-sans' },
        borderRadius: 'rounded-lg'
      },
      copy: {
        headline: `Experience ${product}`,
        subheadline: 'Quality you can trust. Limited availability.',
        cta: 'Shop Now',
        features: [{ title: 'Premium Quality', description: 'Built to last.' }],
        socialProof: 'Join thousands of happy customers'
      },
      components: {
        hero: { type: 'hero-centered' },
        features: { type: 'grid-3' },
        gallery: { type: 'grid' }
      }
    };
  }
}

interface ProductInfo {
  name: string;
  description: string;
  price: number;
  inventoryCount: number;
  vibePrompt: string;
  imageUrl: string;
}

export async function generateCustomHTML(productInfo: ProductInfo): Promise<string> {
  const baseHTML = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${productInfo.name}</title>
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body>
  <div class="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
    <div class="container mx-auto px-4 py-12 md:py-20">
      <div class="grid md:grid-cols-2 gap-12 items-center max-w-7xl mx-auto">
        <!-- Product Image -->
        <div class="relative group">
          <div class="absolute -inset-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl opacity-20 group-hover:opacity-30 blur-2xl transition-opacity duration-500"></div>
          <div class="relative bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-200">
            <img src="${productInfo.imageUrl}" alt="${productInfo.name}" class="w-full aspect-square object-cover">
          </div>
        </div>

        <!-- Product Info -->
        <div class="space-y-8">
          <div>
            <h1 class="text-5xl md:text-7xl font-black mb-4 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent leading-tight">
              ${productInfo.name}
            </h1>
            <p class="text-xl md:text-2xl text-gray-600 leading-relaxed">
              Premium quality product
            </p>
          </div>

          <p class="text-lg text-gray-700 leading-relaxed border-l-4 border-blue-500 pl-4">
            ${productInfo.description}
          </p>

          <!-- Price -->
          <div class="flex items-baseline gap-4">
            <span class="text-5xl font-bold text-gray-900">
              $${(productInfo.price / 100).toFixed(2)}
            </span>
            <span class="text-lg text-gray-500">per unit</span>
          </div>

          <!-- Inventory Status -->
          <div class="flex items-center gap-2">
            <svg class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
            </svg>
            <span class="text-green-700 font-medium">
              ${productInfo.inventoryCount} in stock
            </span>
          </div>

          <!-- CTA Button -->
          <button onclick="handleBuy()" class="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold text-lg px-8 py-5 rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 flex items-center justify-center gap-3">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path>
            </svg>
            Shop Now
          </button>
        </div>
      </div>
    </div>
  </div>

  <script>
    function handleBuy() {
      // This will be replaced with actual checkout logic
      alert('Checkout coming soon!');
    }
  </script>
</body>
</html>
  `;

  const systemPrompt = `
You are an expert web designer and developer. You will receive:
1. Product information (name, description, price, inventory, vibe/style prompt, image URL)
2. A base HTML template

Your task is to customize the HTML based on the product information and vibe/style prompt.

REQUIREMENTS:
- Keep the same structure and functionality (the handleBuy function, Tailwind classes)
- Customize colors, fonts, layout, animations, and copy based on the vibe prompt
- Make it visually stunning and match the product's vibe (e.g., "Luxury" = elegant fonts and gold accents, "Cyberpunk" = neon colors and sharp edges)
- Use Tailwind CSS classes (the template already includes Tailwind CDN)
- Ensure the product image, name, description, price, and inventory count are displayed
- **CRITICAL**: You MUST use the EXACT image URL provided in the product information. Do NOT use placeholder images!
- The image tag should be: <img src="{{IMAGE_URL}}" alt="{{PRODUCT_NAME}}" class="...">
- Keep the button functional with onclick="handleBuy()"
- Return ONLY the complete HTML code, no markdown code blocks or explanations
- Make sure all text content is creative and matches the vibe

The HTML should be production-ready and visually impressive.
`;

  try {
    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 4096,
      temperature: 0.8,
      system: systemPrompt,
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'image',
              source: {
                type: 'url',
                url: productInfo.imageUrl,
              },
            },
            {
              type: 'text',
              text: `
Product Information:
- Name: ${productInfo.name}
- Description: ${productInfo.description}
- Price: $${(productInfo.price / 100).toFixed(2)}
- Inventory: ${productInfo.inventoryCount} in stock
- Vibe/Style: ${productInfo.vibePrompt}
- **Product Image URL (USE THIS EXACT URL)**: ${productInfo.imageUrl}

Above, you can SEE the actual product image. Use your visual understanding of this image to create amazing copy and design that matches the product.

Base HTML Template:
${baseHTML}

IMPORTANT: Replace the image src with the EXACT URL provided above: ${productInfo.imageUrl}

Please customize this HTML to match the product's vibe while keeping all the functionality intact.
`,
            },
          ],
        },
      ],
    });

    const content = message.content[0].type === 'text' ? message.content[0].text : '';
    // Remove any markdown code block syntax if present
    const htmlString = content
      .replace(/```html/g, '')
      .replace(/```/g, '')
      .trim();

    return htmlString;

  } catch (error) {
    console.error('Error generating custom HTML:', error);
    // Return the base template as fallback
    return baseHTML;
  }
}
