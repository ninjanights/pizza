import prisma from "../config/database.js";

export async function getAllSessions() {
  return prisma.session.findMany({
    orderBy: {
      createdAt: "desc",
    },
    include: {
      orders: {
        select: {
          id: true,
          status: true,
          total: true,
          createdAt: true,
        },
      },
    },
  });
}