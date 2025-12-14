
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
      model: 'claude-sonnet-4-20250514',
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
  console.log("🎨 Generating HTML with product info:", {
    name: productInfo.name,
    imageUrl: productInfo.imageUrl,
    price: productInfo.price,
    vibe: productInfo.vibePrompt,
  });

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
    async function handleBuy() {
      const button = event.target.closest('button');
      const originalText = button.innerHTML;

      try {
        // Show loading state
        button.disabled = true;
        button.innerHTML = '<svg class="w-6 h-6 animate-spin mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>';

        // Extract slug from URL (/drop/[slug])
        const pathParts = window.location.pathname.split('/');
        const slug = pathParts[pathParts.length - 1];

        // Call checkout API
        const response = await fetch(\`/api/checkout/\${slug}\`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        const data = await response.json();

        if (data.success && data.checkoutUrl) {
          // Redirect to Flowglad checkout
          window.location.href = data.checkoutUrl;
        } else {
          throw new Error(data.error || 'Failed to create checkout session');
        }
      } catch (error) {
        console.error('Checkout error:', error);
        alert('Unable to proceed to checkout. Please try again.');
        button.disabled = false;
        button.innerHTML = originalText;
      }
    }
  </script>
</body>
</html>
  `;

  const systemPrompt = `
You are an elite web designer and front-end developer specializing in high-converting, visually stunning product landing pages.

Your task: Transform the provided base HTML template into a beautiful, on-brand product page that perfectly matches the specified vibe/aesthetic.

CRITICAL RULES:
1. **IMAGE URL**: You MUST use the EXACT image URL provided. Replace ALL instances of placeholder images with: ${productInfo.imageUrl}
2. **NO PLACEHOLDERS**: The image src must be the real product image URL, not placehold.co or any placeholder
3. **FUNCTIONALITY**: Keep the handleBuy() function intact - do not modify the JavaScript
4. **TAILWIND ONLY**: Use only Tailwind CSS classes (CDN is included)
5. **COMPLETE HTML**: Return ONLY the full HTML document, no markdown, no explanations, no code blocks
6. **VIBE MATCHING**: The design MUST strongly reflect the vibe/aesthetic specified

DESIGN GUIDELINES BY VIBE:
- **Luxury**: Gold/black palette, serif fonts (font-serif), elegant spacing, subtle animations, premium feel
- **Minimalist**: Clean lines, lots of whitespace, simple colors (gray/white), sans-serif, understated
- **Cyberpunk**: Neon colors (cyan/magenta/purple), futuristic fonts, glitch effects, dark backgrounds
- **Streetwear**: Bold typography, graffiti-inspired, urban colors (orange/black), energetic
- **Organic/Natural**: Earth tones (green/brown), rounded corners, soft shadows, calming
- **Modern/Tech**: Clean gradients, sharp edges, blue/purple, glass morphism effects

REQUIRED ELEMENTS:
- Product image with proper aspect ratio and styling
- Product name as prominent headline
- Product description (rewrite creatively to match vibe)
- Price displayed clearly and stylishly
- Inventory/stock status with visual indicator
- Call-to-action button with engaging copy (not just "Buy Now" - be creative!)
- Responsive design (mobile-first)

QUALITY STANDARDS:
- Typography hierarchy must be clear
- Color palette must be cohesive (2-4 colors max)
- Hover states and transitions for interactivity
- Professional spacing and alignment
- Visual interest through gradients, shadows, or animations
- Copy should be punchy and match the vibe

Return ONLY the HTML. No markdown formatting, no explanations.
`;

  const userPrompt = `
PRODUCT DETAILS:
Name: ${productInfo.name}
Description: ${productInfo.description}
Price: $${(productInfo.price / 100).toFixed(2)}
Inventory: ${productInfo.inventoryCount} units in stock
Vibe/Aesthetic: ${productInfo.vibePrompt}

🔴 CRITICAL - PRODUCT IMAGE URL (USE EXACTLY AS PROVIDED):
${productInfo.imageUrl}

BASE HTML TEMPLATE TO CUSTOMIZE:
${baseHTML}

INSTRUCTIONS:
1. Replace the placeholder image src with the exact URL above: ${productInfo.imageUrl}
2. Customize the design to match the "${productInfo.vibePrompt}" vibe
3. Rewrite all copy to be engaging and match the aesthetic
4. Ensure price shows as $${(productInfo.price / 100).toFixed(2)}
5. Show inventory as "${productInfo.inventoryCount} in stock"
6. Make the CTA button copy creative and vibe-appropriate

Create a stunning, production-ready HTML page that sells this product.
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
          content: userPrompt,
        },
      ],
    });

    const content = message.content[0].type === 'text' ? message.content[0].text : '';
    // Remove any markdown code block syntax if present
    let htmlString = content
      .replace(/```html/g, '')
      .replace(/```/g, '')
      .trim();

    // CRITICAL FIX: Ensure the correct image URL is in the final HTML
    // Replace any placeholder or wrong image URLs with the correct one
    htmlString = htmlString.replace(
      /https:\/\/placehold\.co\/[^"'\s]*/g,
      productInfo.imageUrl
    );

    // Also replace any remaining Product+Image placeholders
    htmlString = htmlString.replace(
      /text=Product\+Image/g,
      `Product: ${productInfo.name}`
    );

    console.log("✅ HTML generated successfully with image URL:", productInfo.imageUrl);

    return htmlString;

  } catch (error) {
    console.error('Error generating custom HTML:', error);
    // Return the base template with correct image as fallback
    return baseHTML.replace(
      'https://placehold.co/600x400/png?text=Product+Image',
      productInfo.imageUrl
    );
  }
}
