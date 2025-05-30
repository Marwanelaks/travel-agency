// Site-wide configuration settings

// Gradient color presets for theming
export type GradientPreset = {
  id: string;
  name: string;
  headerGradient: string;
  heroGradient: string;
  primaryButtonGradient: string;
  secondaryButtonGradient: string;
  textGradient: string;
};

// Available color schemes
export const gradientPresets: GradientPreset[] = [
  {
    id: 'blue-purple',
    name: 'Ocean Sunset',
    headerGradient: 'from-blue-500 to-purple-600',
    heroGradient: 'from-blue-900/80 to-purple-900/80',
    primaryButtonGradient: 'from-indigo-500 via-purple-500 to-pink-500 hover:from-indigo-600 hover:via-purple-600 hover:to-pink-600',
    secondaryButtonGradient: 'from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700',
    textGradient: 'from-yellow-300 via-pink-400 to-yellow-300',
  },
  {
    id: 'green-blue',
    name: 'Tropical Paradise',
    headerGradient: 'from-green-500 to-teal-600',
    heroGradient: 'from-green-900/80 to-teal-900/80',
    primaryButtonGradient: 'from-green-500 via-teal-500 to-cyan-500 hover:from-green-600 hover:via-teal-600 hover:to-cyan-600',
    secondaryButtonGradient: 'from-teal-500 to-cyan-600 hover:from-teal-600 hover:to-cyan-700',
    textGradient: 'from-yellow-300 via-green-400 to-yellow-300',
  },
  {
    id: 'amber-red',
    name: 'Desert Sunset',
    headerGradient: 'from-amber-500 to-red-600',
    heroGradient: 'from-amber-900/80 to-red-900/80',
    primaryButtonGradient: 'from-amber-500 via-orange-500 to-red-500 hover:from-amber-600 hover:via-orange-600 hover:to-red-600',
    secondaryButtonGradient: 'from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700',
    textGradient: 'from-yellow-300 via-amber-400 to-yellow-300',
  },
  {
    id: 'purple-pink',
    name: 'Berry Fusion',
    headerGradient: 'from-purple-500 to-pink-600',
    heroGradient: 'from-purple-900/80 to-pink-900/80',
    primaryButtonGradient: 'from-purple-500 via-fuchsia-500 to-pink-500 hover:from-purple-600 hover:via-fuchsia-600 hover:to-pink-600',
    secondaryButtonGradient: 'from-fuchsia-500 to-pink-600 hover:from-fuchsia-600 hover:to-pink-700',
    textGradient: 'from-yellow-300 via-fuchsia-400 to-yellow-300',
  },
  {
    id: 'gray-slate',
    name: 'Professional',
    headerGradient: 'from-gray-700 to-slate-800',
    heroGradient: 'from-gray-900/90 to-slate-900/90',
    primaryButtonGradient: 'from-gray-700 via-slate-700 to-gray-800 hover:from-gray-800 hover:via-slate-800 hover:to-gray-900',
    secondaryButtonGradient: 'from-slate-600 to-gray-700 hover:from-slate-700 hover:to-gray-800',
    textGradient: 'from-gray-200 via-white to-gray-200',
  }
];

// Featured products configuration
export type FeaturedProductSetting = {
  enabled: boolean;
  title: string;
  description: string;
  maxProducts: number;
  productIds: number[];
  autoSelectStrategy?: 'newest' | 'popular' | 'discounted' | 'random';
};

// Default site configuration
export const siteConfig = {
  siteName: 'TravelEase',
  siteDescription: 'Find your perfect travel experience',
  contactEmail: 'info@travelease.example.com',
  socialLinks: {
    twitter: 'https://twitter.com/example',
    facebook: 'https://facebook.com/example',
    instagram: 'https://instagram.com/example'
  },
  activeGradient: 'blue-purple', // Default gradient preset
  featuredProducts: {
    enabled: true,
    title: 'Featured Destinations',
    description: 'Explore our top picks for your next unforgettable adventure',
    maxProducts: 8,
    productIds: [], // Will be populated from dashboard
    autoSelectStrategy: 'popular' // If no products are manually selected
  } as FeaturedProductSetting,
  // Additional site-wide settings can be added here
};

// Export a function to get the active gradient preset
export function getActiveGradientPreset(): GradientPreset {
  const activeId = localStorage.getItem('activeGradientPreset') || siteConfig.activeGradient;
  return gradientPresets.find(preset => preset.id === activeId) || gradientPresets[0];
}

export default siteConfig;
