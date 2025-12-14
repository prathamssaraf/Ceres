
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
