// All categories / words in a single file as requested
export interface WordPair {
  left: string;
  right: string;
  category: string;
}

export const WORD_PAIRS: WordPair[] = [
  { category: "Food", left: "Bland", right: "Delicious" },
  { category: "Food", left: "Healthy", right: "Junk Food" },
  { category: "Food", left: "Gross", right: "Tasty" },
  { category: "Food", left: "Cheap Eats", right: "Fine Dining" },
  { category: "Food", left: "Cold", right: "Hot" },
  { category: "Food", left: "Light Snack", right: "Hearty Meal" },
  { category: "Food", left: "Mild", right: "Spicy" },
  { category: "Food", left: "Sweet", right: "Savory" },
  { category: "Food", left: "Underrated", right: "Overrated" },
  { category: "Food", left: "Street Food", right: "Gourmet" },

  { category: "Movies & TV", left: "Art House", right: "Blockbuster" },
  { category: "Movies & TV", left: "Serious Drama", right: "Silly Comedy" },
  { category: "Movies & TV", left: "Boring", right: "Action Packed" },
  { category: "Movies & TV", left: "Underrated", right: "Overrated" },
  { category: "Movies & TV", left: "Old School", right: "Modern Classic" },
  { category: "Movies & TV", left: "Predictable", right: "Mind Blowing" },
  { category: "Movies & TV", left: "Feel Good", right: "Traumatic" },
  { category: "Movies & TV", left: "Low Budget", right: "Big Budget" },
  { category: "Movies & TV", left: "Niche", right: "Mainstream" },
  { category: "Movies & TV", left: "Cult Classic", right: "Blockbuster Hit" },

  { category: "People", left: "Introvert", right: "Extrovert" },
  { category: "People", left: "Shy", right: "Outgoing" },
  { category: "People", left: "Awkward", right: "Smooth" },
  { category: "People", left: "Nice", right: "Rude" },
  { category: "People", left: "Lazy", right: "Hardworking" },
  { category: "People", left: "Cautious", right: "Reckless" },
  { category: "People", left: "Book Smart", right: "Street Smart" },
  { category: "People", left: "Pessimist", right: "Optimist" },
  { category: "People", left: "Weird", right: "Cool" },
  { category: "People", left: "Dry Sense of Humor", right: "Goofball" },

  { category: "Music", left: "Oldies", right: "Modern" },
  { category: "Music", left: "Underground", right: "Mainstream" },
  { category: "Music", left: "Chill", right: "Hype" },
  { category: "Music", left: "Sad Songs", right: "Party Songs" },
  { category: "Music", left: "Acoustic", right: "EDM" },
  { category: "Music", left: "Guilty Pleasure", right: "Actually Good" },
  { category: "Music", left: "Overplayed", right: "Underrated" },
  { category: "Music", left: "Niche", right: "Everyone Knows It" },
  { category: "Music", left: "Relaxing", right: "Energetic" },
  { category: "Music", left: "Classic Rock", right: "Pop" },

  { category: "Internet", left: "Wholesome", right: "Toxic" },
  { category: "Internet", left: "Old Internet", right: "New Internet" },
  { category: "Internet", left: "Normal", right: "Weird" },
  { category: "Internet", left: "Underrated Meme", right: "Overused Meme" },
  { category: "Internet", left: "Cringe", right: "Based" },
  { category: "Internet", left: "Lurker", right: "Poster" },
  { category: "Internet", left: "Brainrot", right: "High Art" },
  { category: "Internet", left: "Cute", right: "Unsettling" },
  { category: "Internet", left: "NPC", right: "Main Character" },
  { category: "Internet", left: "Funny", right: "Too Far" },

  { category: "Activities", left: "Boring", right: "Exciting" },
  { category: "Activities", left: "Relaxing", right: "Exhausting" },
  { category: "Activities", left: "Indoor", right: "Outdoor" },
  { category: "Activities", left: "Cheap", right: "Expensive" },
  { category: "Activities", left: "Solo", right: "Group Activity" },
  { category: "Activities", left: "Easy", right: "Difficult" },
  { category: "Activities", left: "Planned", right: "Spontaneous" },
  { category: "Activities", left: "Awkward", right: "Fun" },
  { category: "Activities", left: "Responsible", right: "Irresponsible" },
  { category: "Activities", left: "Chill Hangout", right: "Wild Night Out" },

  { category: "Hot Takes", left: "Reasonable Opinion", right: "Unhinged Hot Take" },
  { category: "Hot Takes", left: "Mildly Controversial", right: "Fight Starting" },
  { category: "Hot Takes", left: "Agree With", right: "Absolutely Wrong" },
  { category: "Hot Takes", left: "Common Opinion", right: "Contrarian" },
  { category: "Hot Takes", left: "Safe Take", right: "Blasphemous" },
  { category: "Hot Takes", left: "Sensible", right: "Deranged" },
  { category: "Hot Takes", left: "Subtle", right: "Unapologetic" },
  { category: "Hot Takes", left: "Tame", right: "Provocative" },
  { category: "Hot Takes", left: "Rational", right: "Unreasonably Passionate" },
  { category: "Hot Takes", left: "Forgotten", right: "Still Heated About" },

  { category: "Everyday", left: "Useful", right: "Useless" },
  { category: "Everyday", left: "Necessary", right: "Luxury" },
  { category: "Everyday", left: "Cheap", right: "Overpriced" },
  { category: "Everyday", left: "Practical", right: "Pointless" },
  { category: "Everyday", left: "Satisfying", right: "Infuriating" },
  { category: "Everyday", left: "Organized", right: "Chaotic" },
  { category: "Everyday", left: "Early Bird", right: "Night Owl" },
  { category: "Everyday", left: "Responsible Adult", right: "Ferrel Child" },
  { category: "Everyday", left: "Clean", right: "Messy" },
  { category: "Everyday", left: "Efficient", right: "Procrastinator" },

  { category: "Pop Culture", left: "90s", right: "2000s" },
  { category: "Pop Culture", left: "Boy Band", right: "Pop Princess" },
  { category: "Pop Culture", left: "Nostalgic", right: "Forgotten" },
  { category: "Pop Culture", left: "Iconic", right: "Obscure" },
  { category: "Pop Culture", left: "Peak", right: "Cringe" },
  { category: "Pop Culture", left: "Classic", right: "Trend" },
  { category: "Pop Culture", left: "Teen Heartthrob", right: "Villain" },
  { category: "Pop Culture", left: "Disney Channel", right: "Adult Swim" },
  { category: "Pop Culture", left: "Millennial", right: "Gen Z" },
  { category: "Pop Culture", left: "Y2K", right: "Grungy" },

  { category: "Vibe", left: "Cozy", right: "Chaotic" },
  { category: "Vibe", left: "Romantic", right: "Platonic" },
  { category: "Vibe", left: "Wholesome", right: "Degenerate" },
  { category: "Vibe", left: "Calm", right: "Unhinged" },
  { category: "Vibe", left: "Mysterious", right: "Obnoxious" },
  { category: "Vibe", left: "Sophisticated", right: "Ratchet" },
  { category: "Vibe", left: "Chill", right: "Rowdy" },
  { category: "Vibe", left: "Dreamy", right: "Unsettling" },
  { category: "Vibe", left: "Cute", right: "Cursed" },
  { category: "Vibe", left: "Comfortable", right: "Uncomfortable" },
];

export function getRandomPair(): WordPair {
  const idx = Math.floor(Math.random() * WORD_PAIRS.length);
  return WORD_PAIRS[idx];
}

export function getCategories(): string[] {
  const set = new Set(WORD_PAIRS.map((p) => p.category));
  return Array.from(set).sort();
}
