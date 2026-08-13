import prisma from "../config/database.js";
export const getMenuItems = async () => {
    return prisma.menuItem.findMany({
        where: {
            isAvailable: true, 
        }, orderBy: {
            createdAt: "asc"
        }
    })
}