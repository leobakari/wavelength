import { RoomState, Player } from "./types";
import { getRandomPair } from "@/data/categories";
import { Redis } from "@upstash/redis";

let redis: Redis | null = null;

function getRedis() {
  if (redis) return redis;
  if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
    redis = new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL,
      token: process.env.UPSTASH_REDIS_REST_TOKEN,
    });
    return redis;
  }
  return null;
}

class RoomStore {
  private rooms = new Map<string, RoomState>();

  private key(roomId: string) {
    return `shrotalength:room:${roomId}`;
  }

  private async save(room: RoomState) {
    const r = getRedis();
    if (r) {
      try {
        await r.set(this.key(room.id), room, { ex: 7200 });
      } catch (e) {
        console.error("Redis save error:", e);
      }
    } else {
      this.rooms.set(room.id, room);
    }
  }

  private async load(roomId: string): Promise<RoomState | undefined> {
    const r = getRedis();
    if (r) {
      try {
        const data = await r.get<RoomState>(this.key(roomId));
        if (data) return data;
      } catch (e) {
        console.error("Redis load error:", e);
      }
    }
    return this.rooms.get(roomId);
  }

  async createRoom(hostName: string, maxRounds: number = 10): Promise<RoomState> {
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

    await this.save(room);
    if (!getRedis()) this.rooms.set(roomId, room);
    return room;
  }

  async getRoom(roomId: string): Promise<RoomState | undefined> {
    return this.load(roomId.toUpperCase());
  }

  async joinRoom(roomId: string, playerName: string): Promise<{ room: RoomState; playerId: string } | null> {
    const id = roomId.toUpperCase();
    const room = await this.load(id);
    if (!room) return null;
    if (room.players.length >= 10) throw new Error("Room is full (max 10 players)");
    if (room.status !== "lobby") throw new Error("Game already in progress");

    const playerId = Math.random().toString(36).substring(2, 11);
    const now = Date.now();

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
    await this.save(room);
    return { room, playerId };
  }

  private startNewRound(room: RoomState): void {
    room.round += 1;
    const pair = getRandomPair();
    room.pair = pair;
    room.targetPosition = Math.floor(Math.random() * 101);
    room.clue = null;
    room.guessPosition = null;
    room.scoresThisRound = {};
    room.status = "clue";

    const psychicIndex = (room.round - 1) % room.players.length;
    room.players.forEach((p, idx) => {
      if (idx === psychicIndex) {
        p.role = "psychic";
      } else {
        p.role = "guesser";
      }
    });
  }

  async startGame(roomId: string, hostId: string): Promise<RoomState | null> {
    const room = await this.load(roomId.toUpperCase());
    if (!room) return null;
    if (room.hostId !== hostId) throw new Error("Only host can start");
    if (room.players.length < 2) throw new Error("Need at least 2 players");
    if (room.status !== "lobby") throw new Error("Game already started");

    this.startNewRound(room);
    room.lastActivity = Date.now();
    await this.save(room);
    return room;
  }

  async giveClue(roomId: string, playerId: string, clue: string): Promise<RoomState | null> {
    const room = await this.load(roomId.toUpperCase());
    if (!room) return null;
    const player = room.players.find((p) => p.id === playerId);
    if (!player) throw new Error("Player not found");
    if (player.role !== "psychic") throw new Error("Only psychic can give clue");
    if (room.status !== "clue") throw new Error("Not in clue phase");

    room.clue = clue.trim();
    room.status = "guess";
    room.lastActivity = Date.now();
    await this.save(room);
    return room;
  }

  async makeGuess(roomId: string, playerId: string, guessPosition: number): Promise<RoomState | null> {
    const room = await this.load(roomId.toUpperCase());
    if (!room) return null;
    const player = room.players.find((p) => p.id === playerId);
    if (!player) throw new Error("Player not found");
    if (player.role === "psychic") throw new Error("Psychic cannot guess");
    if (room.status !== "guess") throw new Error("Not in guess phase");
    if (guessPosition < 0 || guessPosition > 100) throw new Error("Invalid guess");

    room.guessPosition = Math.round(guessPosition);
    room.status = "reveal";
    room.lastActivity = Date.now();
    await this.save(room);
    return room;
  }

  async reveal(roomId: string, hostId: string): Promise<RoomState | null> {
    const room = await this.load(roomId.toUpperCase());
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
    await this.save(room);
    return room;
  }

  async nextRound(roomId: string, hostId: string): Promise<RoomState | null> {
    const room = await this.load(roomId.toUpperCase());
    if (!room) return null;
    if (room.hostId !== hostId) throw new Error("Only host can continue");
    if (room.status !== "reveal") throw new Error("Not ready for next round");

    if (room.round >= room.maxRounds) {
      room.status = "finished";
      room.lastActivity = Date.now();
      await this.save(room);
      return room;
    }

    this.startNewRound(room);
    room.lastActivity = Date.now();
    await this.save(room);
    return room;
  }

  async endGame(roomId: string, hostId: string): Promise<RoomState | null> {
    const room = await this.load(roomId.toUpperCase());
    if (!room) return null;
    if (room.hostId !== hostId) throw new Error("Only host can end");
    room.status = "finished";
    room.lastActivity = Date.now();
    await this.save(room);
    return room;
  }

  async cleanup(): Promise<void> {
    // Redis handles TTL
  }
}

const globalForRoomStore = global as unknown as { roomStore: RoomStore };
export const roomStore = globalForRoomStore.roomStore || new RoomStore();
if (process.env.NODE_ENV !== "production") globalForRoomStore.roomStore = roomStore;
