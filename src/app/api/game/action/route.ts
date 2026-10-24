import { NextRequest, NextResponse } from "next/server";
import { roomStore } from "@/lib/roomStore";
import { getPusherServer } from "@/lib/pusher-server";
import { GameActionRequest } from "@/lib/types";

export async function POST(request: NextRequest) {
  try {
    const body: GameActionRequest = await request.json();
    const { roomId, playerId, action, clue, guessPosition } = body;

    if (!roomId || !playerId || !action) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const pusher = getPusherServer();
    const roomIdUpper = roomId.toUpperCase();
    let room = null;

    switch (action) {
      case "start":
        room = await roomStore.startGame(roomIdUpper, playerId);
        break;
      case "giveClue":
        if (!clue) {
          return NextResponse.json({ error: "Clue is required" }, { status: 400 });
        }
        room = await roomStore.giveClue(roomIdUpper, playerId, clue);
        break;
      case "makeGuess":
        if (guessPosition === undefined || guessPosition === null) {
          return NextResponse.json({ error: "Guess position is required" }, { status: 400 });
        }
        room = await roomStore.makeGuess(roomIdUpper, playerId, guessPosition);
        break;
      case "reveal":
        room = await roomStore.reveal(roomIdUpper, playerId);
        break;
      case "nextRound":
        room = await roomStore.nextRound(roomIdUpper, playerId);
        break;
      case "endGame":
        room = await roomStore.endGame(roomIdUpper, playerId);
        break;
      default:
        return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }

    if (!room) {
      return NextResponse.json({ error: "Action failed" }, { status: 400 });
    }

    try {
      await pusher.trigger(`room-${room.id}`, "game-update", {
        room,
        action,
      });
    } catch (e) {
      // Ignore pusher errors
    }

    return NextResponse.json({ room });
  } catch (error) {
    console.error("Error performing game action:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to perform action" },
      { status: 500 }
    );
  }
}
