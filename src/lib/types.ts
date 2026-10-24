export type Role = "psychic" | "guesser" | "spectator";

export interface Player {
  id: string;
  name: string;
  role: Role;
  isHost: boolean;
  score: number;
  joinedAt: number;
}

export interface RoomState {
  id: string;
  hostId: string;
  players: Player[];
  status: "lobby" | "clue" | "guess" | "reveal" | "finished";
  round: number;
  maxRounds: number;
  pair: {
    left: string;
    right: string;
    category: string;
  } | null;
  targetPosition: number; // 0-100 where the bullseye is
  clue: string | null;
  guessPosition: number | null;
  scoresThisRound: Record<string, number>;
  roundHistory: Array<{
    round: number;
    pair: { left: string; right: string; category: string };
    targetPosition: number;
    clue: string | null;
    guessPosition: number | null;
    points: number;
  }>;
  createdAt: number;
  lastActivity: number;
}

export interface CreateRoomRequest {
  name: string;
  maxRounds?: number;
}

export interface JoinRoomRequest {
  roomId: string;
  name: string;
}

export interface GameActionRequest {
  roomId: string;
  playerId: string;
  action: "start" | "giveClue" | "makeGuess" | "reveal" | "nextRound" | "endGame";
  clue?: string;
  guessPosition?: number;
}
