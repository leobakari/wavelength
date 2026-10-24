import { RoomState, Player } from "./types";
import { getRandomPair } from "@/data/categories";

class RoomStore {
  private rooms = new Map<string, RoomState>();

  createRoom(hostName: string, maxRounds: number = 10): RoomState {
    const roomId = Math.random().toString(36).substring(2, 8).toUpperCase();
    const hostId = Math.random().toString(36).substring(2, 11);
    const now = Date.now();

    const host: Player = {
      id: hostId,
      name: hostName,
      role: "psychic",
      isHost: true,
      score: 0,
      joinedAt: now,
    };

    const room: RoomState = {
      id: roomId,
      hostId,
      players: [host],
      status: "lobby",
      round: 0,
      maxRounds,
      pair: null,
      targetPosition: 50,
      clue: null,
      guessPosition: null,
      scoresThisRound: {},
      roundHistory: [],
      createdAt: now,
      lastActivity: now,
    };

    this.rooms.set(roomId, room);
    return room;
  }

  getRoom(roomId: string): RoomState | undefined {
    return this.rooms.get(roomId);
  }

  joinRoom(roomId: string, playerName: string): { room: RoomState; playerId: string } | null {
    const room = this.rooms.get(roomId);
    if (!room) return null;
    if (room.players.length >= 10) throw new Error("Room is full (max 10 players)");
    if (room.status !== "lobby") throw new Error("Game already in progress");

    const playerId = Math.random().toString(36).substring(2, 11);
    const now = Date.now();

    // New players join as guessers/spectators (rotate later)
    const newPlayer: Player = {
      id: playerId,
      name: playerName,
      role: room.players.length === 0 ? "psychic" : "guesser",
      isHost: false,
      score: 0,
      joinedAt: now,
    };

    room.players.push(newPlayer);
    room.lastActivity = now;
    this.rooms.set(roomId, room);

    return { room, playerId };
  }

  startGame(roomId: string, hostId: string): RoomState | null {
    const room = this.rooms.get(roomId);
    if (!room) return null;
    if (room.hostId !== hostId) throw new Error("Only host can start");
    if (room.players.length < 2) throw new Error("Need at least 2 players");
    if (room.status !== "lobby") throw new Error("Game already started");

    this.startNewRound(room);
    room.lastActivity = Date.now();
    this.rooms.set(roomId, room);
    return room;
  }

  startNewRound(room: RoomState): void {
    room.round += 1;
    const pair = getRandomPair();
    room.pair = pair;
    room.targetPosition = Math.floor(Math.random() * 101); // 0-100
    room.clue = null;
    room.guessPosition = null;
    room.scoresThisRound = {};
    room.status = "clue";

    // Rotate psychic role
    const psychicIndex = (room.round - 1) % room.players.length;
    room.players.forEach((p, idx) => {
      if (idx === psychicIndex) {
        p.role = "psychic";
      } else {
        p.role = "guesser";
      }
    });
  }

  giveClue(roomId: string, playerId: string, clue: string): RoomState | null {
    const room = this.rooms.get(roomId);
    if (!room) return null;
    const player = room.players.find((p) => p.id === playerId);
    if (!player) throw new Error("Player not found");
    if (player.role !== "psychic") throw new Error("Only psychic can give clue");
    if (room.status !== "clue") throw new Error("Not in clue phase");

    room.clue = clue.trim();
    room.status = "guess";
    room.lastActivity = Date.now();
    this.rooms.set(roomId, room);
    return room;
  }

  makeGuess(roomId: string, playerId: string, guessPosition: number): RoomState | null {
    const room = this.rooms.get(roomId);
    if (!room) return null;
    const player = room.players.find((p) => p.id === playerId);
    if (!player) throw new Error("Player not found");
    if (player.role === "psychic") throw new Error("Psychic cannot guess");
    if (room.status !== "guess") throw new Error("Not in guess phase");
    if (guessPosition < 0 || guessPosition > 100) throw new Error("Invalid guess");

    // For simplicity, take the first guess or average? Let's take the guess (or could be team guess)
    // In classic Wavelength, team guesses together; here we'll take the guess if only one guesser or just record it
    room.guessPosition = Math.round(guessPosition);
    room.status = "reveal";
    room.lastActivity = Date.now();
    this.rooms.set(roomId, room);
    return room;
  }

  reveal(roomId: string, hostId: string): RoomState | null {
    const room = this.rooms.get(roomId);
    if (!room) return null;
    if (room.hostId !== hostId) throw new Error("Only host can reveal");
    if (room.status !== "reveal") throw new Error("Not in reveal phase");
    if (!room.pair || room.guessPosition === null) return room;

    const diff = Math.abs(room.targetPosition - room.guessPosition);
    let points = 0;
    if (diff <= 4) points = 4;
    else if (diff <= 9) points = 3;
    else if (diff <= 14) points = 2;
    else if (diff <= 19) points = 1;
    else points = 0;

    // Award points to guessers (everyone except psychic gets points in this implementation)
    room.players.forEach((p) => {
      if (p.role !== "psychic") {
        p.score += points;
        room.scoresThisRound[p.id] = points;
      } else {
        room.scoresThisRound[p.id] = 0;
      }
    });

    if (room.pair) {
      room.roundHistory.push({
        round: room.round,
        pair: room.pair,
        targetPosition: room.targetPosition,
        clue: room.clue,
        guessPosition: room.guessPosition,
        points,
      });
    }

    room.lastActivity = Date.now();
    this.rooms.set(roomId, room);
    return room;
  }

  nextRound(roomId: string, hostId: string): RoomState | null {
    const room = this.rooms.get(roomId);
    if (!room) return null;
    if (room.hostId !== hostId) throw new Error("Only host can continue");
    if (room.status !== "reveal") throw new Error("Not ready for next round");

    if (room.round >= room.maxRounds) {
      room.status = "finished";
      room.lastActivity = Date.now();
      this.rooms.set(roomId, room);
      return room;
    }

    this.startNewRound(room);
    room.lastActivity = Date.now();
    this.rooms.set(roomId, room);
    return room;
  }

  endGame(roomId: string, hostId: string): RoomState | null {
    const room = this.rooms.get(roomId);
    if (!room) return null;
    if (room.hostId !== hostId) throw new Error("Only host can end");
    room.status = "finished";
    room.lastActivity = Date.now();
    this.rooms.set(roomId, room);
    return room;
  }

  // Cleanup old rooms (older than 2 hours)
  cleanup(): void {
    const now = Date.now();
    const twoHours = 2 * 60 * 60 * 1000;
    for (const [id, room] of this.rooms.entries()) {
      if (now - room.lastActivity > twoHours) {
        this.rooms.delete(id);
      }
    }
  }
}

// Singleton instance
const globalForRoomStore = global as unknown as { roomStore: RoomStore };
export const roomStore = globalForRoomStore.roomStore || new RoomStore();
if (process.env.NODE_ENV !== "production") globalForRoomStore.roomStore = roomStore;

// Run cleanup every 30 minutes
if (typeof setInterval !== "undefined") {
  setInterval(() => {
    roomStore.cleanup();
  }, 30 * 60 * 1000);
}
