import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import prisma from "../config/database.js";

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined");
}


function getJwtSecret(): string {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new Error("JWT_SECRET is not defined");
  }

  return secret;
}

export async function loginAdmin(email: string, password: string) {

  console.log(email, password, "54");
  const admin = await prisma.admin.findUnique({
    where: {
      email,
    },
  });

  if (!admin) {
    return null;
  }

  const passwordValid = await bcrypt.compare(password, admin.passwordHash);

  if (!passwordValid) {
    return null;
  }

  const token = jwt.sign(
    {
      adminId: admin.id,
      email: admin.email,
    },
    getJwtSecret(),
    {
      expiresIn: "8h",
    },
  );

  return {
    token,
    admin: {
      id: admin.id,
      email: admin.email,
    },
  };
}
