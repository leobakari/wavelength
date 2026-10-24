# Wavelength - Multiplayer

A fully functional multiplayer version of Wavelength built with Next.js 16, TypeScript, Tailwind CSS, and Pusher for real-time updates. Deployable on Vercel with up to 10 players per room.

## Features

- 🎮 **Multiplayer** - Up to 10 players per room
- 🏠 **Room System** - Create or join rooms with shareable codes
- 🎯 **Classic Gameplay** - Psychic gives clues, guessers find the sweet spot
- 📊 **Scoring System** - Points based on how close the guess is (4, 3, 2, 1, or 0 points)
- 🔄 **Round Rotation** - Psychic role rotates each round
- 📈 **Score Tracking** - Track scores across multiple rounds
- ⚡ **Real-time Updates** - Powered by Pusher
- 📁 **All Data in One File** - Categories and words are in `src/data/categories.ts`

## How to Play

1. Create a room or join with a room code
2. Share the room code with up to 9 other players (need at least 2 to start)
3. Host starts the game
4. Each round, one player is the Psychic who sees the target position
5. Psychic gives a clue to help guessers find where the target is on the spectrum
6. Guessers dial in their guess and submit it
7. Host reveals the target and points are awarded based on accuracy
8. Play through all rounds and see the final scores!

## Scoring

- Within 4 points: 4 points
- Within 9 points: 3 points
- Within 14 points: 2 points
- Within 19 points: 1 point
- More than 19 points away: 0 points

## Tech Stack

- [Next.js 16](https://nextjs.org/) - React framework with App Router
- [TypeScript](https://www.typescriptlang.org/) - Type safety
- [Tailwind CSS v4](https://tailwindcss.com/) - Styling
- [Pusher](https://pusher.com/) - Real-time WebSocket communication
- [React 19](https://react.dev/) - UI library

## Setup for Development

1. Install dependencies:
```bash
npm install
```

2. (Optional) Set up Pusher for real-time sync across multiple devices:
   - Sign up at [pusher.com](https://pusher.com)
   - Create a new app
   - Copy the credentials to `.env.local`:

```env
NEXT_PUBLIC_PUSHER_KEY=your_key
NEXT_PUBLIC_PUSHER_CLUSTER=your_cluster
PUSHER_APP_ID=your_app_id
PUSHER_SECRET=your_secret
```

Note: The game works without Pusher in single-tab dev (uses polling/state sync), but Pusher is recommended for real multiplayer across devices.

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000)

## Deploy to Vercel

1. Push your code to GitHub
2. Import the project in [Vercel](https://vercel.com)
3. Add environment variables if using Pusher (recommended for production):
   - `NEXT_PUBLIC_PUSHER_KEY`
   - `NEXT_PUBLIC_PUSHER_CLUSTER`
   - `PUSHER_APP_ID`
   - `PUSHER_SECRET`
4. Deploy!

Vercel will automatically detect Next.js and build/deploy your app.

## Project Structure

```
src/
├── app/                    # Next.js App Router pages and API routes
│   ├── api/               # API endpoints for room management and game actions
│   ├── room/[id]/         # Game room page
│   └── page.tsx           # Home page (create/join)
├── data/
│   └── categories.ts      # ALL categories and words in one file
├── lib/
│   ├── roomStore.ts       # In-memory room state management
│   ├── types.ts           # TypeScript types
│   ├── pusher-server.ts   # Pusher server instance
│   └── pusher-client.ts   # Pusher client instance
└── components/            # React components (if needed)
```

## Notes

- Room state is stored in memory on the server. For production with multiple serverless instances, consider using Redis or a database. For Vercel's serverless functions, in-memory works within the same instance but may not persist across invocations - Pusher helps sync state.
- The game supports up to 10 players per room as requested.
- All categories and words are in a single file: `src/data/categories.ts`
- Works great on Vercel out of the box!
