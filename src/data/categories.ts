// All categories / words in a single file as requested
export interface WordPair {
  left: string;
  right: string;
  category: string;
}

export const WORD_PAIRS: WordPair[] = [
  { category: "Food", left: "Bad", right: "Good" },
  { category: "Food", left: "Bland", right: "Flavorful" },
  { category: "Food", left: "Healthy", right: "Unhealthy" },
  { category: "Food", left: "Hot", right: "Cold" },
  { category: "Food", left: "Cheap", right: "Expensive" },
  { category: "Food", left: "Light", right: "Heavy" },
  { category: "Food", left: "Dry", right: "Juicy" },
  { category: "Food", left: "Stale", right: "Fresh" },
  { category: "Food", left: "Mild", right: "Spicy" },
  { category: "Food", left: "Plain", right: "Gourmet" },

  { category: "Movies", left: "Art House", right: "Blockbuster" },
  { category: "Movies", left: "Scary", right: "Romantic" },
  { category: "Movies", left: "Old", right: "New" },
  { category: "Movies", left: "Serious", right: "Silly" },
  { category: "Movies", left: "Slow", right: "Action Packed" },
  { category: "Movies", left: "Low Budget", right: "Big Budget" },
  { category: "Movies", left: "Unknown", right: "Cult Classic" },
  { category: "Movies", left: "Predictable", right: "Mind Blowing" },
  { category: "Movies", left: "Sad", right: "Funny" },
  { category: "Movies", left: "Violent", right: "Wholesome" },

  { category: "People", left: "Introvert", right: "Extrovert" },
  { category: "People", left: "Kind", right: "Mean" },
  { category: "People", left: "Quiet", right: "Loud" },
  { category: "People", left: "Serious", right: "Playful" },
  { category: "People", left: "Old Fashioned", right: "Trendy" },
  { category: "People", left: "Shy", right: "Confident" },
  { category: "People", left: "Calm", right: "Anxious" },
  { category: "People", left: "Pessimistic", right: "Optimistic" },
  { category: "People", left: "Practical", right: "Dreamy" },
  { category: "People", left: "Reserved", right: "Outgoing" },

  { category: "Technology", left: "Old School", right: "Cutting Edge" },
  { category: "Technology", left: "Simple", right: "Complex" },
  { category: "Technology", left: "Cheap", right: "Expensive" },
  { category: "Technology", left: "Fragile", right: "Durable" },
  { category: "Technology", left: "Slow", right: "Fast" },
  { category: "Technology", left: "Bulky", right: "Portable" },
  { category: "Technology", left: "Manual", right: "Automatic" },
  { category: "Technology", left: "Obscure", right: "Ubiquitous" },
  { category: "Technology", left: "Low Tech", right: "High Tech" },
  { category: "Technology", left: "Risky", right: "Safe" },

  { category: "Activities", left: "Relaxing", right: "Exhausting" },
  { category: "Activities", left: "Boring", right: "Exciting" },
  { category: "Activities", left: "Cheap", right: "Expensive" },
  { category: "Activities", left: "Indoor", right: "Outdoor" },
  { category: "Activities", left: "Solo", right: "Social" },
  { category: "Activities", left: "Easy", right: "Difficult" },
  { category: "Activities", left: "Safe", right: "Dangerous" },
  { category: "Activities", left: "Local", right: "Exotic" },
  { category: "Activities", left: "Planned", right: "Spontaneous" },
  { category: "Activities", left: "Passive", right: "Active" },

  { category: "Music", left: "Quiet", right: "Loud" },
  { category: "Music", left: "Melancholic", right: "Upbeat" },
  { category: "Music", left: "Underground", right: "Mainstream" },
  { category: "Music", left: "Simple", right: "Complex" },
  { category: "Music", left: "Old", right: "Modern" },
  { category: "Music", left: "Calm", right: "Energetic" },
  { category: "Music", left: "Acoustic", right: "Electronic" },
  { category: "Music", left: "Sad", right: "Happy" },
  { category: "Music", left: "Niche", right: "Popular" },
  { category: "Music", left: "Slow", right: "Fast" },

  { category: "Random", left: "Evil", right: "Good" },
  { category: "Random", left: "Hot", right: "Cold" },
  { category: "Random", left: "Big", right: "Small" },
  { category: "Random", left: "Short", right: "Long" },
  { category: "Random", left: "Hard", right: "Soft" },
  { category: "Random", left: "Bright", right: "Dark" },
  { category: "Random", left: "Wet", right: "Dry" },
  { category: "Random", left: "Smooth", right: "Rough" },
  { category: "Random", left: "Fast", right: "Slow" },
  { category: "Random", left: "Common", right: "Rare" },
];

export function getRandomPair(): WordPair {
  const idx = Math.floor(Math.random() * WORD_PAIRS.length);
  return WORD_PAIRS[idx];
}

export function getCategories(): string[] {
  const set = new Set(WORD_PAIRS.map((p) => p.category));
  return Array.from(set).sort();
}
