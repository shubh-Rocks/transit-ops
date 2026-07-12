require("dotenv/config");

const { neonConfig } = require("@neondatabase/serverless");
const { PrismaNeon } = require("@prisma/adapter-neon");
const { PrismaClient, Role } = require("@prisma/client");
const bcrypt = require("bcryptjs");
const ws = require("ws");

neonConfig.webSocketConstructor = ws;

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is not set.");
}

const adapter = new PrismaNeon({ connectionString });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("🌱 Starting Database Seeding...");

  // ---------------------------------------------------------
  // 1. SEED USERS
  // ---------------------------------------------------------
  const password = await bcrypt.hash("12345678", 10);

  const users = [
    {
      name: "Fleet Manager",
      email: "fleet@demo.com",
      role: Role.FLEET_MANAGER,
    },
    { name: "Driver", email: "driver@demo.com", role: Role.DRIVER },
    {
      name: "Safety Officer",
      email: "safety@demo.com",
      role: Role.SAFETY_OFFICER,
    },
    {
      name: "Financial Analyst",
      email: "finance@demo.com",
      role: Role.FINANCIAL_ANALYST,
    },
  ];

  for (const user of users) {
    await prisma.user.upsert({
      where: { email: user.email },
      update: {},
      create: {
        name: user.name,
        email: user.email,
        password,
        role: user.role,
      },
    });
  }
  console.log("✅ Demo users seeded successfully.");

  // ---------------------------------------------------------
  // 2. SEED VEHICLES
  // ---------------------------------------------------------
  // Added 3 extra vehicles to match your Expense/Fuel references (up to VEHICLE_ID_5)
  const vehicleData = [
    {
      registrationNumber: "MP09AB1234",
      name: "Tata Prima",
      model: "2024",
      type: "TRUCK",
      maxLoadCapacity: 28000,
      odometer: 85000,
      acquisitionCost: 3200000,
      status: "AVAILABLE",
      region: "Indore",
    },
    {
      registrationNumber: "MP04CD5678",
      name: "Ashok Leyland",
      model: "2023",
      type: "TRUCK",
      maxLoadCapacity: 25000,
      odometer: 112000,
      acquisitionCost: 2900000,
      status: "ON_TRIP",
      region: "Bhopal",
    },
    {
      registrationNumber: "MH01EF9012",
      name: "Mahindra Blazo",
      model: "2022",
      type: "TRUCK",
      maxLoadCapacity: 22000,
      odometer: 145000,
      acquisitionCost: 2500000,
      status: "AVAILABLE",
      region: "Mumbai",
    },
    {
      registrationNumber: "GJ01GH3456",
      name: "Eicher Pro",
      model: "2024",
      type: "VAN",
      maxLoadCapacity: 8000,
      odometer: 32000,
      acquisitionCost: 1500000,
      status: "IN_SHOP",
      region: "Ahmedabad",
    },
    {
      registrationNumber: "DL01IJ7890",
      name: "BharatBenz",
      model: "2023",
      type: "TRUCK",
      maxLoadCapacity: 30000,
      odometer: 78000,
      acquisitionCost: 3500000,
      status: "AVAILABLE",
      region: "Delhi",
    },
  ];

  const createdVehicles = [];
  for (const v of vehicleData) {
    const vehicle = await prisma.vehicle.upsert({
      where: { registrationNumber: v.registrationNumber },
      update: {},
      create: v,
    });
    createdVehicles.push(vehicle);
  }
  console.log("✅ Vehicles seeded successfully.");

  // Clean up old logs to prevent duplicates during multiple seed runs
  await prisma.expense.deleteMany();
  await prisma.fuelLog.deleteMany();

  // ---------------------------------------------------------
  // 3. SEED EXPENSES
  // ---------------------------------------------------------
  // Replaced dummy strings with actual IDs from the newly created vehicles
  await prisma.expense.createMany({
    data: [
      {
        vehicleId: createdVehicles[0].id,
        type: "TOLL",
        amount: 1800,
        description: "Delhi Expressway Toll",
      },
      {
        vehicleId: createdVehicles[1].id,
        type: "MAINTENANCE",
        amount: 12500,
        description: "Brake Pad Replacement",
      },
      {
        vehicleId: createdVehicles[2].id,
        type: "OTHER",
        amount: 2200,
        description: "Vehicle Washing",
      },
      {
        vehicleId: createdVehicles[3].id,
        type: "TOLL",
        amount: 1500,
        description: "Mumbai Toll Plaza",
      },
      {
        vehicleId: createdVehicles[4].id,
        type: "MAINTENANCE",
        amount: 8600,
        description: "Engine Oil Service",
      },
      {
        vehicleId: createdVehicles[0].id,
        type: "OTHER",
        amount: 3200,
        description: "Parking Charges",
      },
      {
        vehicleId: createdVehicles[1].id,
        type: "TOLL",
        amount: 2500,
        description: "Highway Toll",
      },
      {
        vehicleId: createdVehicles[2].id,
        type: "MAINTENANCE",
        amount: 19500,
        description: "Clutch Replacement",
      },
      {
        vehicleId: createdVehicles[3].id,
        type: "OTHER",
        amount: 1800,
        description: "Cleaning Service",
      },
      {
        vehicleId: createdVehicles[4].id,
        type: "TOLL",
        amount: 2750,
        description: "State Highway Toll",
      },
    ],
  });
  console.log("✅ Expenses seeded successfully.");

  // ---------------------------------------------------------
  // 4. SEED FUEL LOGS
  // ---------------------------------------------------------
  await prisma.fuelLog.createMany({
    data: [
      { vehicleId: createdVehicles[0].id, liters: 120, cost: 12600 },
      { vehicleId: createdVehicles[1].id, liters: 180, cost: 18900 },
      { vehicleId: createdVehicles[2].id, liters: 95, cost: 9975 },
      { vehicleId: createdVehicles[3].id, liters: 150, cost: 15750 },
      { vehicleId: createdVehicles[4].id, liters: 210, cost: 22050 },
      { vehicleId: createdVehicles[0].id, liters: 135, cost: 14175 },
      { vehicleId: createdVehicles[1].id, liters: 80, cost: 8400 },
      { vehicleId: createdVehicles[2].id, liters: 175, cost: 18375 },
      { vehicleId: createdVehicles[3].id, liters: 90, cost: 9450 },
      { vehicleId: createdVehicles[4].id, liters: 140, cost: 14700 },
    ],
  });
  console.log(" Fuel logs seeded successfully.");
  console.log(" Database seeding complete!");
}

main()
  .catch((e) => {
    console.error("❌ Seeding Error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
