import { NextRequest, NextResponse } from "next/server";
import { roomStore } from "@/lib/roomStore";
import { getPusherServer } from "@/lib/pusher-server";
import { JoinRoomRequest } from "@/lib/types";

export async function POST(request: NextRequest) {
  try {
    const body: JoinRoomRequest = await request.json();
    const { roomId, name } = body;

    if (!roomId || !name) {
      return NextResponse.json({ error: "Room ID and name are required" }, { status: 400 });
    }

    const result = roomStore.joinRoom(roomId.toUpperCase(), name.trim());
    if (!result) {
      return NextResponse.json({ error: "Room not found" }, { status: 404 });
    }

    const pusher = getPusherServer();
    try {
      await pusher.trigger(`room-${result.room.id}`, "player-joined", {
        room: result.room,
        playerId: result.playerId,
      });
    } catch (e) {
      // Ignore pusher errors
    }

    return NextResponse.json({
      room: result.room,
      playerId: result.playerId,
    });
  } catch (error) {
    console.error("Error joining room:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to join room" },
      { status: 500 }
    );
  }
}
