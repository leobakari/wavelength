import Pusher from "pusher-js";

let pusherInstance: Pusher | null = null;

export function getPusherClient() {
  if (typeof window === "undefined") return null;
  if (!pusherInstance) {
    const key = process.env.NEXT_PUBLIC_PUSHER_KEY || "dev-key";
    const cluster = process.env.NEXT_PUBLIC_PUSHER_CLUSTER || "mt1";
    pusherInstance = new Pusher(key, {
      cluster,
    });
  }
  return pusherInstance;
}
