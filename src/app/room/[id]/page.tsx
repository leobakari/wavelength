"use client";

import { Suspense, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { RoomState, Player } from "@/lib/types";
import { getPusherClient } from "@/lib/pusher-client";

function RoomPageContent() {
  const params = useParams();
  const router = useRouter();
  const roomId = params.id as string;

  const [room, setRoom] = useState<RoomState | null>(null);
  const [playerId, setPlayerId] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [clue, setClue] = useState("");
  const [guessPos, setGuessPos] = useState(50);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    const storedPlayerId = localStorage.getItem(`wavelength_${roomId}`);
    if (!storedPlayerId) {
      router.push("/");
      return;
    }
    setPlayerId(storedPlayerId);
    fetchRoom();
  }, [roomId, router]);

  useEffect(() => {
    if (!roomId) return;
    const pusher = getPusherClient();
    if (!pusher) return;

    const channel = pusher.subscribe(`room-${roomId}`);
    channel.bind("game-update", (data: { room: RoomState }) => {
      setRoom(data.room);
    });
    channel.bind("player-joined", (data: { room: RoomState }) => {
      setRoom(data.room);
    });
    channel.bind("room-created", (data: { room: RoomState }) => {
      setRoom(data.room);
    });

    return () => {
      channel.unbind_all();
      pusher.unsubscribe(`room-${roomId}`);
    };
  }, [roomId]);

  const fetchRoom = async () => {
    try {
      const res = await fetch(`/api/room/${roomId}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setRoom(data.room);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load room");
    } finally {
      setLoading(false);
    }
  };

  const performAction = async (action: string, extra: any = {}) => {
    setActionLoading(true);
    try {
      const res = await fetch("/api/game/action", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          roomId,
          playerId,
          action,
          ...extra,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setRoom(data.room);
      if (action === "giveClue") setClue("");
    } catch (err) {
      alert(err instanceof Error ? err.message : "Action failed");
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-1 items-center justify-center bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  if (error || !room) {
    return (
      <div className="flex flex-1 items-center justify-center bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
        <div className="text-center">
          <div className="text-red-400 text-xl mb-4">{error || "Room not found"}</div>
          <button
            onClick={() => router.push("/")}
            className="px-6 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  const currentPlayer = room.players.find((p) => p.id === playerId);
  const isHost = currentPlayer?.isHost || false;
  const isPsychic = currentPlayer?.role === "psychic";
  const isGuesser = currentPlayer?.role === "guesser";

  const getScoreColor = (diff: number) => {
    if (diff <= 4) return "#22c55e";
    if (diff <= 9) return "#84cc16";
    if (diff <= 14) return "#eab308";
    if (diff <= 19) return "#f97316";
    return "#ef4444";
  };

  return (
    <div className="flex flex-col flex-1 bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-4 overflow-auto">
      <div className="max-w-6xl mx-auto w-full">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-white">WAVELENGTH</h1>
            <p className="text-purple-200">
              Room: <span className="font-mono font-bold">{room.id}</span> • Round {room.round}/{room.maxRounds}
            </p>
          </div>
          <button
            onClick={() => router.push("/")}
            className="px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20"
          >
            Leave Room
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Game Area */}
          <div className="lg:col-span-2 space-y-6">
            {/* Status */}
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
              <div className="text-center mb-4">
                <span className="px-4 py-2 bg-purple-500 text-white rounded-full text-sm font-semibold uppercase">
                  {room.status === "lobby" && "Lobby - Waiting to Start"}
                  {room.status === "clue" && `${isPsychic ? "You are the" : room.players.find((p) => p.role === "psychic")?.name + " is the"} Psychic - Give a Clue`}
                  {room.status === "guess" && "Guessers - Make Your Guess"}
                  {room.status === "reveal" && "Revealing Results"}
                  {room.status === "finished" && "Game Finished"}
                </span>
              </div>

              {room.status === "lobby" && (
                <div className="text-center space-y-4">
                  <p className="text-white">Share room code <span className="font-mono font-bold text-yellow-300">{room.id}</span> with others (max 10 players)</p>
                  {isHost ? (
                    <button
                      onClick={() => performAction("start")}
                      disabled={room.players.length < 2 || actionLoading}
                      className="px-8 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-bold rounded-lg hover:from-green-600 hover:to-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {actionLoading ? "Starting..." : room.players.length < 2 ? "Need at least 2 players" : "Start Game"}
                    </button>
                  ) : (
                    <p className="text-purple-200">Waiting for host to start...</p>
                  )}
                </div>
              )}

              {(room.status === "clue" || room.status === "guess" || room.status === "reveal") && room.pair ? (
                <div className="space-y-6">
                  {/* Spectrum Display */}
                  <div className="relative">
                    <div className="flex justify-between text-white font-bold text-lg mb-2">
                      <span>{room.pair.left}</span>
                      <span className="text-purple-300 text-sm">{room.pair.category}</span>
                      <span>{room.pair.right}</span>
                    </div>
                    <div className="relative h-12 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full overflow-hidden">
                      {(isPsychic || room.status === "reveal") && (
                        <div
                          className="absolute top-0 h-full bg-yellow-400 opacity-40"
                          style={{
                            left: `${Math.max(0, room.targetPosition - 15)}%`,
                            width: "30%",
                          }}
                        />
                      )}
                      {room.guessPosition !== null && (
                        <div
                          className="absolute top-0 h-full w-1 bg-white shadow-lg"
                          style={{ left: `${room.guessPosition}%` }}
                        >
                          <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-white text-purple-900 px-2 py-1 rounded text-xs font-bold">
                            GUESS
                          </div>
                        </div>
                      )}
                      {room.status === "reveal" && (
                        <div
                          className="absolute top-0 h-full w-1 bg-yellow-300 shadow-lg"
                          style={{ left: `${room.targetPosition}%` }}
                        >
                          <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 bg-yellow-300 text-purple-900 px-2 py-1 rounded text-xs font-bold">
                            TARGET
                          </div>
                        </div>
                      )}
                      {isPsychic && room.status !== "reveal" && (
                        <div
                          className="absolute top-0 h-full w-1 bg-yellow-400"
                          style={{ left: `${room.targetPosition}%` }}
                        >
                          <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-yellow-400 text-purple-900 px-2 py-1 rounded text-xs font-bold">
                            TARGET
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="flex justify-between text-white/60 text-xs mt-1">
                      <span>0</span>
                      <span>25</span>
                      <span>50</span>
                      <span>75</span>
                      <span>100</span>
                    </div>
                  </div>

                  {room.clue && (
                    <div className="text-center p-4 bg-white/10 rounded-xl">
                      <p className="text-purple-200 text-sm mb-1">Clue:</p>
                      <p className="text-white text-2xl font-bold italic">"{room.clue}"</p>
                    </div>
                  )}

                  {room.status === "clue" && isPsychic && (
                    <div className="space-y-3">
                      <p className="text-white text-center">
                        The target is at <span className="font-bold text-yellow-400">{room.targetPosition}%</span>. Give your team a clue!
                      </p>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={clue}
                          onChange={(e) => setClue(e.target.value)}
                          placeholder="Enter your clue..."
                          className="flex-1 px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500"
                          maxLength={50}
                        />
                        <button
                          onClick={() => performAction("giveClue", { clue })}
                          disabled={!clue.trim() || actionLoading}
                          className="px-6 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold rounded-lg hover:from-purple-600 hover:to-pink-600 disabled:opacity-50"
                        >
                          {actionLoading ? "Sending..." : "Give Clue"}
                        </button>
                      </div>
                    </div>
                  )}

                  {room.status === "guess" && isGuesser && room.guessPosition === null && (
                    <div className="space-y-3">
                      <p className="text-white text-center">Dial in your guess on the spectrum!</p>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={guessPos}
                        onChange={(e) => setGuessPos(parseInt(e.target.value))}
                        className="w-full"
                      />
                      <div className="text-center text-white">
                        Your guess: <span className="font-bold text-yellow-400">{guessPos}%</span>
                      </div>
                      <button
                        onClick={() => performAction("makeGuess", { guessPosition: guessPos })}
                        disabled={actionLoading}
                        className="w-full py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-bold rounded-lg hover:from-blue-600 hover:to-cyan-600 disabled:opacity-50"
                      >
                        {actionLoading ? "Submitting..." : "Submit Guess"}
                      </button>
                    </div>
                  )}

                  {room.status === "guess" && !isGuesser && (
                    <p className="text-center text-purple-200">Waiting for guessers to guess...</p>
                  )}

                  {room.status === "reveal" && (
                    <div className="text-center space-y-4">
                      {room.guessPosition !== null && (
                        <p className="text-white text-lg">
                          Difference:{" "}
                          <span className="font-bold" style={{ color: getScoreColor(Math.abs(room.targetPosition - room.guessPosition)) }}>
                            {Math.abs(room.targetPosition - room.guessPosition)} points away
                          </span>
                        </p>
                      )}
                      {isHost ? (
                        <div className="flex gap-3 justify-center">
                          <button
                            onClick={() => performAction("reveal")}
                            disabled={actionLoading}
                            className="px-6 py-2 bg-gradient-to-r from-yellow-500 to-orange-500 text-white font-bold rounded-lg hover:from-yellow-600 hover:to-orange-600 disabled:opacity-50"
                          >
                            {actionLoading ? "Calculating..." : "Calculate Points"}
                          </button>
                          <button
                            onClick={() => performAction(room.round >= room.maxRounds ? "endGame" : "nextRound")}
                            disabled={actionLoading}
                            className="px-6 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-bold rounded-lg hover:from-green-600 hover:to-emerald-600 disabled:opacity-50"
                          >
                            {actionLoading ? "Loading..." : room.round >= room.maxRounds ? "End Game" : "Next Round"}
                          </button>
                        </div>
                      ) : (
                        <p className="text-purple-200">Waiting for host...</p>
                      )}
                    </div>
                  )}
                </div>
              ) : null}

              {room.status === "finished" && (
                <div className="text-center space-y-4">
                  <h2 className="text-2xl font-bold text-white">Game Over!</h2>
                  <div className="space-y-2">
                    {[...room.players]
                      .sort((a, b) => b.score - a.score)
                      .map((p, idx) => (
                        <div
                          key={p.id}
                          className={`flex justify-between items-center p-3 rounded-lg ${
                            idx === 0 ? "bg-yellow-500/20 border border-yellow-400" : "bg-white/10"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <span className="text-2xl">{idx === 0 ? "🥇" : idx === 1 ? "🥈" : idx === 2 ? "🥉" : `#${idx + 1}`}</span>
                            <span className="text-white font-semibold">{p.name}</span>
                          </div>
                          <span className="text-white font-bold text-lg">{p.score} pts</span>
                        </div>
                      ))}
                  </div>
                  <button
                    onClick={() => router.push("/")}
                    className="px-6 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600"
                  >
                    Play Again
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Players */}
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
              <h2 className="text-xl font-bold text-white mb-4">
                Players ({room.players.length}/10)
              </h2>
              <div className="space-y-2">
                {room.players.map((p) => (
                  <div
                    key={p.id}
                    className={`flex items-center justify-between p-2 rounded-lg ${
                      p.id === playerId ? "bg-purple-500/30" : "bg-white/5"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-2 h-2 rounded-full ${
                          p.role === "psychic"
                            ? "bg-yellow-400"
                            : p.role === "guesser"
                            ? "bg-blue-400"
                            : "bg-gray-400"
                        }`}
                      />
                      <span className="text-white text-sm">
                        {p.name}
                        {p.isHost && " 👑"}
                        {p.id === playerId && " (you)"}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      {room.status !== "lobby" && (
                        <span className="text-xs text-purple-200 capitalize">{p.role}</span>
                      )}
                      <span className="text-white font-semibold">{p.score}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Round History */}
            {room.roundHistory.length > 0 && (
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
                <h2 className="text-xl font-bold text-white mb-4">History</h2>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {room.roundHistory
                    .slice()
                    .reverse()
                    .map((h, idx) => (
                      <div key={idx} className="p-2 bg-white/5 rounded-lg text-xs">
                        <div className="flex justify-between text-white mb-1">
                          <span className="font-semibold">Round {h.round}</span>
                          <span className="text-green-400">+{h.points} pts</span>
                        </div>
                        <div className="text-purple-200">
                          {h.pair.left} ← {h.clue} → {h.pair.right}
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function RoomPage() {
  return (
    <Suspense
      fallback={
        <div className="flex flex-1 items-center justify-center bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
          <div className="text-white text-xl">Loading room...</div>
        </div>
      }
    >
      <RoomPageContent />
    </Suspense>
  );
}
