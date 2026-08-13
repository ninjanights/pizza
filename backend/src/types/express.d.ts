import type { Session } from "../generated/prisma/client.js";

declare global {
  namespace Express {
    interface Request {
      session?: Session;
    }
  }
}

export {};