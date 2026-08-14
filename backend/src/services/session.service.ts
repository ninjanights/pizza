import prisma from "../config/database.js";
const SESSION_DURATION_MS = 24 * 24 * 60 * 1000;

export const createSession = async () => {
  const expiresAt = new Date(Date.now() + SESSION_DURATION_MS);

  return prisma.session.create({
    data: {
      expiresAt,
    },
  });
};

export async function getSession(sessionId: string) {
  return prisma.session.findUnique({
    where: {
      id: sessionId,
    },
  });
}