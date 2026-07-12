import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(request) {
  try {
    const body = await request.json();

    const fuel = await prisma.fuelLog.create({
      data: {
        vehicleId: body.vehicleId,
        tripId: body.tripId || null,
        liters: Number(body.liters),
        cost: Number(body.cost),
      },
    });

    return NextResponse.json({
      success: true,
      fuel,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Something went wrong",
      },
      {
        status: 500,
      },
    );
  }
}
