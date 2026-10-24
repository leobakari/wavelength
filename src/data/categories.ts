// All categories / words in a single file as requested
// Based on original Wavelength board game + popular community additions
export interface WordPair {
  left: string;
  right: string;
  category: string;
}

export const WORD_PAIRS: WordPair[] = [
  // Core / Classic
  { category: "Basics", left: "Good", right: "Bad" },
  { category: "Basics", left: "Hot", right: "Cold" },
  { category: "Basics", left: "Big", right: "Small" },
  { category: "Basics", left: "Old", right: "New" },
  { category: "Basics", left: "Hard", right: "Easy" },
  { category: "Basics", left: "Safe", right: "Dangerous" },
  { category: "Basics", left: "Cheap", right: "Expensive" },
  { category: "Basics", left: "Fast", right: "Slow" },
  { category: "Basics", left: "Common", right: "Rare" },
  { category: "Basics", left: "Natural", right: "Artificial" },

  // People & Personality
  { category: "People", left: "Introvert", right: "Extrovert" },
  { category: "People", left: "Mature", right: "Immature" },
  { category: "People", left: "Nice", right: "Mean" },
  { category: "People", left: "Classy", right: "Trashy" },
  { category: "People", left: "Cool", right: "Uncool" },
  { category: "People", left: "Book Smart", right: "Street Smart" },
  { category: "People", left: "Pessimist", right: "Optimist" },
  { category: "People", left: "Awkward", right: "Smooth" },
  { category: "People", left: "Shy", right: "Outgoing" },
  { category: "People", left: "Rational", right: "Emotional" },

  // Morality & Ethics
  { category: "Morality", left: "Ethical", right: "Unethical" },
  { category: "Morality", left: "Good Person", right: "Bad Person" },
  { category: "Morality", left: "Honest", right: "Deceitful" },
  { category: "Morality", left: "Selfless", right: "Selfish" },
  { category: "Morality", left: "Forgiving", right: "Vengeful" },
  { category: "Morality", left: "Justified", right: "Reprehensible" },
  { category: "Morality", left: "Heroic", right: "Villainous" },
  { category: "Morality", left: "Law Abiding", right: "Criminal" },
  { category: "Morality", left: "Principled", right: "Corrupt" },
  { category: "Morality", left: "Noble", right: "Evil" },

  // Style & Taste
  { category: "Style", left: "Fashionable", right: "Unfashionable" },
  { category: "Style", left: "Classy", right: "Tacky" },
  { category: "Style", left: "Subtle", right: "Flashy" },
  { category: "Style", left: "Minimalist", right: "Maximalist" },
  { category: "Style", left: "Vintage", right: "Trendy" },
  { category: "Style", left: "Elegant", right: "Gaudy" },
  { category: "Style", left: "Timeless", right: "Of The Moment" },
  { category: "Style", left: "Understated", right: "Loud" },
  { category: "Style", left: "Refined", right: "Rough" },
  { category: "Style", left: "High Fashion", right: "Streetwear" },

  // Movies, Music, Media
  { category: "Media", left: "Underrated", right: "Overrated" },
  { category: "Media", left: "Art House", right: "Blockbuster" },
  { category: "Media", left: "Cult Classic", right: "Mainstream Hit" },
  { category: "Media", left: "Predictable", right: "Unpredictable" },
  { category: "Media", left: "Feel Good", right: "Depressing" },
  { category: "Media", left: "Guilty Pleasure", right: "Critically Acclaimed" },
  { category: "Media", left: "Niche", right: "Everyone Knows" },
  { category: "Media", left: "Comfort Rewatch", right: "One And Done" },
  { category: "Media", left: "Bingeable", right: "Hard To Get Through" },
  { category: "Media", left: "Soundtrack Slaps", right: "Forgettable Music" },

  // Food & Drink
  { category: "Food & Drink", left: "Gross", right: "Delicious" },
  { category: "Food & Drink", left: "Cheap", right: "Fancy" },
  { category: "Food & Drink", left: "Comfort Food", right: "Haute Cuisine" },
  { category: "Food & Drink", left: "Mild", right: "Spicy" },
  { category: "Food & Drink", left: "Sweet", right: "Savory" },
  { category: "Food & Drink", left: "Healthy", right: "Junk Food" },
  { category: "Food & Drink", left: "Street Food", right: "Fine Dining" },
  { category: "Food & Drink", left: "Underrated Dish", right: "Overrated Dish" },
  { category: "Food & Drink", left: "Acquired Taste", right: "Universally Loved" },
  { category: "Food & Drink", left: "Coffee Shop", right: "Dive Bar" },

  // Relationships
  { category: "Relationships", left: "Opposites Attract", right: "Birds Of A Feather" },
  { category: "Relationships", left: "Brutal Honesty", right: "Gentle Truth" },
  { category: "Relationships", left: "Talk It Out", right: "Sleep On It" },
  { category: "Relationships", left: "Need Alone Time", right: "Attached At The Hip" },
  { category: "Relationships", left: "Public Affection", right: "Private Affection" },
  { category: "Relationships", left: "Spontaneous Romance", right: "Planned Romance" },
  { category: "Relationships", left: "Honeymoon Phase", right: "Comfortable Routine" },
  { category: "Relationships", left: "Fight Fair", right: "Play Dirty" },
  { category: "Relationships", left: "Forgive And Forget", right: "Hold A Grudge" },
  { category: "Relationships", left: "Crisis Couple", right: "Boringly Stable" },

  // Life & Decisions
  { category: "Life", left: "Planned", right: "Spontaneous" },
  { category: "Life", left: "Risky", right: "Safe" },
  { category: "Life", left: "Short Term Gain", right: "Long Term Gain" },
  { category: "Life", left: "Work Hard", right: "Work Smart" },
  { category: "Life", left: "Settle Down", right: "Stay Wild" },
  { category: "Life", left: "Live In The Now", right: "Plan The Future" },
  { category: "Life", left: "City Life", right: "Country Life" },
  { category: "Life", left: "Minimalist", right: "Packrat" },
  { category: "Life", left: "Early Bird", right: "Night Owl" },
  { category: "Life", left: "Responsible", right: "Reckless" },

  // Things & Concepts
  { category: "Concepts", left: "Permanent", right: "Temporary" },
  { category: "Concepts", left: "Believable", right: "Unbelievable" },
  { category: "Concepts", left: "Necessary", right: "Unnecessary" },
  { category: "Concepts", left: "Useful", right: "Useless" },
  { category: "Concepts", left: "Ordinary", right: "Extraordinary" },
  { category: "Concepts", left: "Logical", right: "Irrational" },
  { category: "Concepts", left: "Pragmatic", right: "Idealistic" },
  { category: "Concepts", left: "Serious", right: "Silly" },
  { category: "Concepts", left: "Sacred", right: "Profane" },
  { category: "Concepts", left: "Freedom", right: "Security" },

  // Fun & Chaotic
  { category: "Party", left: "Wholesome", right: "Degenerate" },
  { category: "Party", left: "Chill Hangout", right: "Wild Night Out" },
  { category: "Party", left: "Cooperative", right: "Competitive" },
  { category: "Party", left: "Clean Fun", right: "Rowdy" },
  { category: "Party", left: "Low Energy", right: "Unhinged" },
  { category: "Party", left: "Good Influence", right: "Bad Influence" },
  { category: "Party", left: "Sober Fun", right: "Chaotic" },
  { category: "Party", left: "Invite Everyone", right: "VIP Only" },
  { category: "Party", left: "Ice Breaker", right: "Too Far" },
  { category: "Party", left: "Board Game Night", right: "Rager" },

  // Modern / Trending
  { category: "Modern", left: "Old Internet", right: "New Internet" },
  { category: "Modern", left: "NPC", right: "Main Character" },
  { category: "Modern", left: "Chronically Online", right: "Terminally Offline" },
  { category: "Modern", left: "Lurker", right: "Overposter" },
  { category: "Modern", left: "Cringe", right: "Based" },
  { category: "Modern", left: "Irony Poisoned", right: "Sincerely Earnest" },
  { category: "Modern", left: "Doomscrolling", right: "Touching Grass" },
  { category: "Modern", left: "Brainrot", right: "High Culture" },
  { category: "Modern", left: "Skibidi", right: "Normie" },
  { category: "Modern", left: "Ragebait", right: "Wholesome Content" },
];

export function getRandomPair(): WordPair {
  const idx = Math.floor(Math.random() * WORD_PAIRS.length);
  return WORD_PAIRS[idx];
}

export function getCategories(): string[] {
  const set = new Set(WORD_PAIRS.map((p) => p.category));
  return Array.from(set).sort();
}
