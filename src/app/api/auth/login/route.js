import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { verifyPassword, generateToken, setAuthCookie } from "@/lib/auth";
import { loginSchema } from "@/validations/auth.validation";

export async function POST(request) {
  try {
    const body = await request.json();

    const validatedFields = loginSchema.safeParse(body);

    if (!validatedFields.success) {
      return NextResponse.json(
        {
          success: false,
          errors: validatedFields.error.flatten().fieldErrors,
        },
        {
          status: 400,
        },
      );
    }

    const { email, password } = validatedFields.data;

    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid email or password",
        },
        {
          status: 401,
        },
      );
    }

    if (!user.isActive) {
      return NextResponse.json(
        {
          success: false,
          message: "Your account has been deactivated.",
        },
        {
          status: 403,
        },
      );
    }

    const isPasswordValid = await verifyPassword(password, user.password);

    if (!isPasswordValid) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid email or password",
        },
        {
          status: 401,
        },
      );
    }

    const token = generateToken(user);

    await setAuthCookie(token);

    return NextResponse.json(
      {
        success: true,
        message: "Login successful.",
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          region: user.region,
        },
      },
      {
        status: 200,
      },
    );
  } catch (error) {
    console.error("Login Error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Something went wrong. Please try again.",
      },
      {
        status: 500,
      },
    );
  }
}
