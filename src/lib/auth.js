import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import prisma from "./prisma";

const JWT_SECRET = process.env.JWT_SECRET;
const SALT_ROUNDS = 10;



export async function hashPassword(password) {
  return await bcrypt.hash(password, SALT_ROUNDS);
}



export async function verifyPassword(password, hashedPassword) {
  return await bcrypt.compare(password, hashedPassword);
}


export function generateToken(user) {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role,
    },
    JWT_SECRET,
    {
      expiresIn: "7d",
    }
  );
}

export function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch {
    return null;
  }
}


export async function setAuthCookie(token) {
  const cookieStore = await cookies();

  cookieStore.set("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7,
    path: "/",
  });
}


export async function removeAuthCookie() {
  const cookieStore = await cookies();

  cookieStore.delete("token");
}


export async function getCurrentUser() {
  try {
    const cookieStore = await cookies();

    const token = cookieStore.get("token")?.value;

    if (!token) return null;

    const decoded = verifyToken(token);

    if (!decoded?.id) return null;

    const user = await prisma.user.findUnique({
      where: {
        id: decoded.id,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        region: true,
        isActive: true,
      },
    });

    if (!user || !user.isActive) {
      return null;
    }

    return user;
  } catch (error) {
    console.error("Get Current User Error:", error);
    return null;
  }
}