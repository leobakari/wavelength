import { NextRequest, NextResponse } from "next/server";
import { roomStore } from "@/lib/roomStore";
import { getPusherServer } from "@/lib/pusher-server";
import { CreateRoomRequest } from "@/lib/types";

export async function POST(request: NextRequest) {
  try {
    const body: CreateRoomRequest = await request.json();
    const { name, maxRounds = 10 } = body;

    if (!name || name.trim().length === 0) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }

    const room = roomStore.createRoom(name.trim(), maxRounds);
    const pusher = getPusherServer();

    // Notify channel (if using real Pusher keys) - create channel will be used by clients
    try {
      await pusher.trigger(`room-${room.id}`, "room-created", {
        room,
      });
    } catch (e) {
      // Ignore pusher errors in dev without keys
    }

    return NextResponse.json({
      room,
      playerId: room.players[0].id,
    });
  } catch (error) {
    console.error("Error creating room:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to create room" },
      { status: 500 }
    );
  }
}
