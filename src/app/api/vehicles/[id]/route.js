import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { createVehicleSchema } from "@/validations/vehicle.validation";

export async function GET(request, { params }) {
  try {
    const { id } = await params;

    const vehicle = await prisma.vehicle.findUnique({
      where: {
        id,
      },
    });

    if (!vehicle) {
      return NextResponse.json(
        {
          success: false,
          message: "Vehicle not found.",
        },
        {
          status: 404,
        },
      );
    }

    return NextResponse.json(
      {
        success: true,
        vehicle,
      },
      {
        status: 200,
      },
    );
  } catch (error) {
    console.error(error);

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

export async function PUT(request, { params }) {
  try {
    const { id } = await params;

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

    const vehicle = await prisma.vehicle.findUnique({
      where: {
        id,
      },
    });

    if (!vehicle) {
      return NextResponse.json(
        {
          success: false,
          message: "Vehicle not found.",
        },
        {
          status: 404,
        },
      );
    }

    const duplicateVehicle = await prisma.vehicle.findFirst({
      where: {
        registrationNumber: data.registrationNumber,
        NOT: {
          id,
        },
      },
    });

    if (duplicateVehicle) {
      return NextResponse.json(
        {
          success: false,
          message: "Registration number already exists.",
        },
        {
          status: 409,
        },
      );
    }

    const updatedVehicle = await prisma.vehicle.update({
      where: {
        id,
      },
      data,
    });

    return NextResponse.json(
      {
        success: true,
        message: "Vehicle updated successfully.",
        vehicle: updatedVehicle,
      },
      {
        status: 200,
      },
    );
  } catch (error) {
    console.error(error);

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

export async function DELETE(request, { params }) {
  try {
    const { id } = await params;

    const vehicle = await prisma.vehicle.findUnique({
      where: {
        id,
      },
    });

    if (!vehicle) {
      return NextResponse.json(
        {
          success: false,
          message: "Vehicle not found.",
        },
        {
          status: 404,
        },
      );
    }

    await prisma.vehicle.delete({
      where: {
        id,
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Vehicle deleted successfully.",
      },
      {
        status: 200,
      },
    );
  } catch (error) {
    console.error(error);

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
