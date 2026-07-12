import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { createMaintenanceLogSchema } from "@/validations/maintenance.validation";

export async function GET() {
  try {
    const maintenanceLogs = await prisma.maintenanceLog.findMany({
      orderBy: { createdAt: "desc" },
      include: { vehicle: true },
    });

    return NextResponse.json(
      {
        success: true,
        maintenanceLogs,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Get Maintenance Logs Error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Unable to load maintenance records.",
      },
      { status: 500 },
    );
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const validated = createMaintenanceLogSchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json(
        {
          success: false,
          errors: validated.error.flatten().fieldErrors,
        },
        { status: 400 },
      );
    }

    const data = validated.data;
    const vehicle = await prisma.vehicle.findUnique({
      where: { id: data.vehicleId },
    });

    if (!vehicle) {
      return NextResponse.json(
        {
          success: false,
          message: "Selected vehicle does not exist.",
        },
        { status: 404 },
      );
    }

    const maintenanceLog = await prisma.maintenanceLog.create({
      data: {
        vehicleId: data.vehicleId,
        title: data.title,
        description: data.description || "",
        cost: data.cost,
        startDate: new Date(data.startDate),
        status: data.status,
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Maintenance record created successfully.",
        maintenanceLog,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Create Maintenance Log Error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Internal Server Error",
      },
      { status: 500 },
    );
  }
}
