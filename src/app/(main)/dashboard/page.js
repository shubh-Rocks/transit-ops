import prisma from "@/lib/prisma";

import { Truck, Route, Users, Wrench } from "lucide-react";

import StatCard from "@/components/dashboard/StatCard";
import QuickActions from "@/components/dashboard/QuickActions";

export default async function DashboardPage() {
  const [
    activeVehicles,
    availableVehicles,
    activeTrips,
    totalDrivers,
    maintenanceVehicles,
  ] = await Promise.all([
    prisma.vehicle.count({
      where: {
        status: "ON_TRIP",
      },
    }),

    prisma.vehicle.count({
      where: {
        status: "AVAILABLE",
      },
    }),

    prisma.trip.count({
      where: {
        status: "DISPATCHED",
      },
    }),

    prisma.driver.count(),

    prisma.vehicle.count({
      where: {
        status: "IN_SHOP",
      },
    }),
  ]);

  return (
    <div className="space-y-8">
      {/* Header */}

      <div>
        <h1 className="text-4xl font-bold text-primary">Dashboard</h1>

        <p className="mt-2 text-gray-500">
          Monitor your fleet operations in real time.
        </p>
      </div>

      {/* KPI */}

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-5">
        <StatCard
          title="Active Vehicles"
          value={activeVehicles}
          href="/vehicles"
          icon={Truck}
          color="bg-primary"
        />

        <StatCard
          title="Available Vehicles"
          value={availableVehicles}
          href="/vehicles"
          icon={Truck}
          color="bg-secondary"
        />

        <StatCard
          title="Active Trips"
          value={activeTrips}
          href="/trips"
          icon={Route}
          color="bg-blue-500"
        />

        <StatCard
          title="Drivers"
          value={totalDrivers}
          href="/drivers"
          icon={Users}
          color="bg-green-600"
        />

        <StatCard
          title="Maintenance"
          value={maintenanceVehicles}
          href="/maintenance"
          icon={Wrench}
          color="bg-orange-500"
        />
      </div>

      {/* Quick Actions */}

      <QuickActions />

      {/* Empty Sections */}

      <div className="grid gap-6 xl:grid-cols-2">
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-xl font-bold text-primary">Recent Trips</h2>

          <p className="text-gray-500">No trips available.</p>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-xl font-bold text-primary">
            Vehicle Status
          </h2>

          <p className="text-gray-500">Analytics will appear here.</p>
        </div>
      </div>
    </div>
  );
}
