import Pusher from "pusher";

let pusherInstance: Pusher | null = null;

export function getPusherServer() {
  if (!pusherInstance) {
    // These env vars are needed for deployment; in dev they can be placeholder
    const appId = process.env.PUSHER_APP_ID || "dev-app";
    const key = process.env.NEXT_PUBLIC_PUSHER_KEY || "dev-key";
    const secret = process.env.PUSHER_SECRET || "dev-secret";
    const cluster = process.env.NEXT_PUBLIC_PUSHER_CLUSTER || "mt1";

    pusherInstance = new Pusher({
      appId,
      key,
      secret,
      cluster,
      useTLS: true,
    });
  }
  return pusherInstance;
}

export function getPusherConfig() {
  return {
    key: process.env.NEXT_PUBLIC_PUSHER_KEY || "dev-key",
    cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER || "mt1",
  };
}
