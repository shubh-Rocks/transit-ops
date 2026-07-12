import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { createVehicleSchema } from "@/validations/vehicle.validation";

export async function POST(request) {
  try {
    const body = await request.json();

    const validatedFields = createVehicleSchema.safeParse(body);

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

    const data = validatedFields.data;

    // Check Duplicate Registration Number
    const existingVehicle = await prisma.vehicle.findUnique({
      where: {
        registrationNumber: data.registrationNumber,
      },
    });

    if (existingVehicle) {
      return NextResponse.json(
        {
          success: false,
          message: "Vehicle with this registration number already exists.",
        },
        {
          status: 409,
        },
      );
    }

    // Create Vehicle
    const vehicle = await prisma.vehicle.create({
      data: {
        registrationNumber: data.registrationNumber,
        name: data.name,
        model: data.model,
        type: data.type,
        maxLoadCapacity: data.maxLoadCapacity,
        odometer: data.odometer,
        acquisitionCost: data.acquisitionCost,
        region: data.region,
        status: data.status,
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Vehicle created successfully.",
        vehicle,
      },
      {
        status: 201,
      },
    );
  } catch (error) {
    console.error("Create Vehicle Error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Internal Server Error",
      },
      {
        status: 500,
      },
    );
  }
}

export async function GET() {
  try {
    const vehicles = await prisma.vehicle.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(
      {
        success: true,
        vehicles,
      },
      {
        status: 200,
      },
    );
  } catch (error) {
    console.error("Get Vehicles Error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Internal Server Error",
      },
      {
        status: 500,
      },
    );
  }
}
