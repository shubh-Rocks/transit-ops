import prisma from "@/lib/prisma";

export default async function AnalyticsPage() {
  const [
    totalVehicles,
    availableVehicles,
    onTripVehicles,
    maintenanceVehicles,
    retiredVehicles,

    totalDrivers,

    activeTrips,

    fuelLogs,
    maintenanceLogs,
    expenses,

    recentTrips,
  ] = await Promise.all([
    prisma.vehicle.count(),

    prisma.vehicle.count({
      where: {
        status: "AVAILABLE",
      },
    }),

    prisma.vehicle.count({
      where: {
        status: "ON_TRIP",
      },
    }),

    prisma.vehicle.count({
      where: {
        status: "IN_SHOP",
      },
    }),

    prisma.vehicle.count({
      where: {
        status: "RETIRED",
      },
    }),

    prisma.driver.count(),

    prisma.trip.count({
      where: {
        status: "DISPATCHED",
      },
    }),

    prisma.fuelLog.findMany(),

    prisma.maintenanceLog.findMany(),

    prisma.expense.findMany(),

    prisma.trip.findMany({
      take: 6,
      orderBy: {
        createdAt: "asc",
      },
    }),
  ]);

  /* ---------------------------- */

  const totalFuelCost = fuelLogs.reduce((sum, fuel) => sum + fuel.cost, 0);

  const totalFuelLiters = fuelLogs.reduce((sum, fuel) => sum + fuel.liters, 0);

  const totalMaintenanceCost = maintenanceLogs.reduce(
    (sum, item) => sum + item.cost,
    0,
  );

  const totalExpense = expenses.reduce(
    (sum, expense) => sum + expense.amount,
    0,
  );

  const totalDistance = recentTrips.reduce(
    (sum, trip) => sum + (trip.actualDistance || 0),
    0,
  );

  const fuelEfficiency =
    totalFuelLiters > 0 ? (totalDistance / totalFuelLiters).toFixed(1) : 0;

  const fleetUtilization =
    totalVehicles > 0 ? ((onTripVehicles / totalVehicles) * 100).toFixed(0) : 0;

  const operationalCost = (
    totalFuelCost +
    totalMaintenanceCost +
    totalExpense
  ).toFixed(0);

  const totalAcquisitionCost = await prisma.vehicle.aggregate({
    _sum: {
      acquisitionCost: true,
    },
  });

  const acquisition = totalAcquisitionCost._sum.acquisitionCost || 0;

  const estimatedRevenue = totalDistance * 35;

  const roi =
    acquisition > 0
      ? (
          ((estimatedRevenue - (totalFuelCost + totalMaintenanceCost)) /
            acquisition) *
          100
        ).toFixed(1)
      : 0;

  const revenueBars = recentTrips.map((trip) => ({
    value: Math.max(20, Math.round((trip.actualDistance || 0) / 4)),
  }));

  return (
    <div className="space-y-8">
      {/* Top Cards */}

      <div className="grid gap-6 lg:grid-cols-4">
        <div className="rounded-2xl border-l-4 border-blue-500 bg-white p-6 shadow">
          <p className="text-sm uppercase tracking-wide text-gray-500">
            Fuel Efficiency
          </p>

          <h2 className="mt-3 text-4xl font-bold">{fuelEfficiency} km/l</h2>
        </div>

        <div className="rounded-2xl border-l-4 border-green-500 bg-white p-6 shadow">
          <p className="text-sm uppercase tracking-wide text-gray-500">
            Fleet Utilization
          </p>

          <h2 className="mt-3 text-4xl font-bold">{fleetUtilization}%</h2>
        </div>

        <div className="rounded-2xl border-l-4 border-yellow-500 bg-white p-6 shadow">
          <p className="text-sm uppercase tracking-wide text-gray-500">
            Operational Cost
          </p>

          <h2 className="mt-3 text-4xl font-bold">₹ {operationalCost}</h2>
        </div>

        <div className="rounded-2xl border-l-4 border-primary bg-white p-6 shadow">
          <p className="text-sm uppercase tracking-wide text-gray-500">
            Vehicle ROI
          </p>

          <h2 className="mt-3 text-4xl font-bold">{roi}%</h2>
        </div>
      </div>

      <p className="text-sm text-gray-500">
        ROI = (Estimated Revenue − Fuel Cost − Maintenance Cost) ÷ Acquisition
        Cost
      </p>

      {/* Graph Section */}

      <div className="grid gap-8 xl:grid-cols-2">
        <div className="rounded-2xl bg-white p-6 shadow">
          <h2 className="mb-8 text-xl font-semibold text-primary">
            Monthly Revenue
          </h2>

          <div className="flex h-72 items-end justify-between gap-4">
            {revenueBars.map((bar, index) => (
              <div
                key={index}
                className="flex-1 rounded-t-xl bg-blue-400 transition-all hover:bg-blue-500"
                style={{
                  height: `${bar.value}%`,
                }}
              />
            ))}
          </div>
        </div>
        {/* Top Costliest Vehicles */}

        <div className="rounded-2xl bg-white p-6 shadow">
          <h2 className="mb-6 text-xl font-semibold text-primary">
            Top Costliest Vehicles
          </h2>

          {(
            await prisma.vehicle.findMany({
              orderBy: {
                acquisitionCost: "desc",
              },
              take: 5,
            })
          ).map((vehicle) => (
            <div
              key={vehicle.id}
              className="mb-6 border-b border-gray-100 pb-4 last:border-none"
            >
              <div className="mb-2 flex items-center justify-between">
                <div>
                  <h3 className="font-semibold">{vehicle.name}</h3>

                  <p className="text-sm text-gray-500">
                    {vehicle.registrationNumber}
                  </p>
                </div>

                <span className="font-semibold text-primary">
                  ₹ {vehicle.acquisitionCost.toLocaleString()}
                </span>
              </div>

              <div className="h-2 overflow-hidden rounded-full bg-gray-200">
                <div
                  className="h-full rounded-full bg-primary"
                  style={{
                    width: `${Math.min(100, vehicle.acquisitionCost / 50000)}%`,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
