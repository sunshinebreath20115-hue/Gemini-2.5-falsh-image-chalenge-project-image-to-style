import { Filter } from './types';

// Define categories to match the localization files for a richer selection
export const CATEGORIES = {
  CINEMATIC: 'Cinematic',
  ARTISTIC: 'Artistic',
  FUTURISTIC: 'Futuristic',
  VINTAGE: 'Vintage',
  ANIMATION: 'Animation',
  FANTASY: 'Fantasy',
  ABSTRACT: 'Abstract',
  PHOTOGRAPHY: 'Photography',
  ILLUSTRATION: 'Illustration',
  GAMING: 'Gaming',
};

// Use a placeholder image service for generic preview images per category.
// This ensures working images without needing local files.
const PREVIEW_IMAGES: { [key: string]: string } = {
  [CATEGORIES.CINEMATIC]: 'https://images.unsplash.com/photo-1535016120720-40c646be5580?w=200&h=200&fit=crop&q=80',
  [CATEGORIES.ARTISTIC]: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=200&h=200&fit=crop&q=80',
  [CATEGORIES.FUTURISTIC]: 'https://images.unsplash.com/photo-1517976487-151859915579?w=200&h=200&fit=crop&q=80',
  [CATEGORIES.VINTAGE]: 'https://images.unsplash.com/photo-1490718593589-ca05e990b343?w=200&h=200&fit=crop&q=80',
  [CATEGORIES.ANIMATION]: 'https://images.unsplash.com/photo-1620573998018-b726055b8509?w=200&h=200&fit=crop&q=80',
  [CATEGORIES.FANTASY]: 'https://images.unsplash.com/photo-1534352824599-c5ce32213600?w=200&h=200&fit=crop&q=80',
  [CATEGORIES.ABSTRACT]: 'https://images.unsplash.com/photo-1509114397022-ed747cca3f65?w=200&h=200&fit=crop&q=80',
  [CATEGORIES.PHOTOGRAPHY]: 'https://images.unsplash.com/photo-1482049016688-2d3e1b311543?w=200&h=200&fit=crop&q=80',
  [CATEGORIES.ILLUSTRATION]: 'https://images.unsplash.com/photo-1605721911519-58b382d577a4?w=200&h=200&fit=crop&q=80',
  [CATEGORIES.GAMING]: 'https://images.unsplash.com/photo-1580234811497-9df7fd2f357e?w=200&h=200&fit=crop&q=80',
  DEFAULT: 'https://images.unsplash.com/photo-1511367461989-f85a21fda167?w=200&h=200&fit=crop&q=80',
};

// Helper function to create a filter object
const createFilter = (name: string, category: string, baseQuery: string): Filter => ({
  id: `${category.toLowerCase().replace(/[^a-z0-9]/g, '')}-${name.toLowerCase().replace(/[^a-z0-9]/g, '')}`,
  name,
  category,
  baseQuery: baseQuery || name, // Fallback to name if baseQuery is empty
  previewImageUrl: PREVIEW_IMAGES[category] || PREVIEW_IMAGES.DEFAULT,
});

// A curated list of high-quality base filters
const handCraftedFilters = [
  // Cinematic
  { name: "Neo-Noir", category: CATEGORIES.CINEMATIC, query: "cinematic neo-noir style, high contrast, dramatic shadows, cool color palette with pops of neon" },
  { name: "Epic Fantasy Film", category: CATEGORIES.CINEMATIC, query: "epic fantasy movie style, grand vistas, rich colors, soft magical lighting, ethereal atmosphere" },
  { name: "80s Action Movie", category: CATEGORIES.CINEMATIC, query: "80s action film look, grainy film texture, vibrant saturated colors, lens flares, anamorphic style" },
  { name: "Wes Anderson Style", category: CATEGORIES.CINEMATIC, query: "Symmetrical composition, pastel color palette, vintage aesthetic, distinct visual storytelling reminiscent of Wes Anderson's films." },
  { name: "Spaghetti Western", category: CATEGORIES.CINEMATIC, query: "Gritty, sun-drenched look of a Spaghetti Western. High contrast, warm tones, and dramatic, wide-angle shots." },

  // Artistic
  { name: "Watercolor Painting", category: CATEGORIES.ARTISTIC, query: "beautiful watercolor painting style, soft edges, vibrant translucent colors, textured paper effect" },
  { name: "Impressionism", category: CATEGORIES.ARTISTIC, query: "impressionist painting style, visible brush strokes, emphasis on light and its changing qualities" },
  { name: "Pop Art", category: CATEGORIES.ARTISTIC, query: "pop art style, bold outlines, bright, vibrant colors, ben-day dots, graphic and iconic" },
  { name: "Japanese Ukiyo-e", category: CATEGORIES.ARTISTIC, query: "Classic Japanese Ukiyo-e woodblock print style. Flat areas of color, bold outlines, and subjects from nature or daily life." },
  { name: "Art Deco", category: CATEGORIES.ARTISTIC, query: "Elegant and sophisticated Art Deco style. Strong geometric shapes, rich colors, and luxurious details." },
  
  // Futuristic
  { name: "Cyberpunk Cityscape", category: CATEGORIES.FUTURISTIC, query: "cyberpunk aesthetic, neon-drenched cityscapes, futuristic technology, gritty and dystopian mood" },
  { name: "Solarpunk Utopia", category: CATEGORIES.FUTURISTIC, query: "solarpunk aesthetic, lush greenery integrated with futuristic architecture, optimistic and bright, renewable energy motifs" },
  { name: "Retro-Futurism", category: CATEGORIES.FUTURISTIC, query: "A vision of the future from the 1950s. Chrome details, atomic age motifs, and a sense of optimistic technology." },
  
  // Vintage
  { name: "Sepia Tone Memory", category: CATEGORIES.VINTAGE, query: "vintage sepia tone photograph, aged paper texture, soft focus, nostalgic and sentimental feeling" },
  { name: "1960s Polaroid", category: CATEGORIES.VINTAGE, query: "1960s polaroid photo style, faded colors, light leaks, soft focus, classic white border" },
  { name: "Victorian Daguerreotype", category: CATEGORIES.VINTAGE, query: "Early photographic style of a Victorian daguerreotype. Muted tones, high detail, and a formal, posed quality." },
];

// --- Procedural Generation to reach 1000+ filters ---
const adjectives = ["Mystical", "Retro", "Cosmic", "Urban", "Pastel", "Vivid", "Monochrome", "Surreal", "Gothic", "Minimalist", "Ethereal", "Radiant", "Subtle", "Bold", "Dreamy", "Gritty"];
const nouns = ["Dream", "Glow", "Wash", "Chrome", "Haze", "Punk", "Wave", "Bloom", "Verse", "Core", "Shift", "Fade", "Echo", "Lens", "Filter", "Tone"];
const categoriesForGeneration = Object.values(CATEGORIES);
const proceduralFilters: { name: string, category: string, query: string }[] = [];
const existingNames = new Set(handCraftedFilters.map(f => `${f.category}-${f.name}`));

// Generate enough filters to ensure we have over 1000 in total
const targetFilterCount = 1000;
while (proceduralFilters.length < targetFilterCount - handCraftedFilters.length) {
    const category = categoriesForGeneration[Math.floor(Math.random() * categoriesForGeneration.length)];
    const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
    const noun = nouns[Math.floor(Math.random() * nouns.length)];
    const name = `${adj} ${noun}`;
    const uniqueNameKey = `${category}-${name}`;

    // Ensure the generated name is unique within its category
    if (!existingNames.has(uniqueNameKey)) {
        proceduralFilters.push({
            name: name,
            category: category,
            query: `An image in the style of ${name}, capturing a ${category.toLowerCase()} aesthetic. Emphasize ${adj.toLowerCase()} tones and a ${noun.toLowerCase()} feel.`
        });
        existingNames.add(uniqueNameKey);
    }
}

// Combine handcrafted and procedurally generated filters
const combinedFilters = [...handCraftedFilters, ...proceduralFilters];

export const FILTERS: Filter[] = combinedFilters.map(f => createFilter(f.name, f.category, f.query));
