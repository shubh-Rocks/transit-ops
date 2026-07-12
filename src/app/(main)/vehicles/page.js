import Link from "next/link";
import prisma from "@/lib/prisma";
import { Plus, Pencil, Trash2 } from "lucide-react";

export default async function VehiclesPage() {
  const vehicles = await prisma.vehicle.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div className="space-y-6">
      {/* Header */}

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-primary">Vehicles</h1>

          <p className="mt-1 text-gray-500">Manage your fleet vehicles.</p>
        </div>

        <Link
          href="/vehicles/new"
          className="flex items-center gap-2 rounded-xl bg-primary px-5 py-3 font-medium text-white transition hover:opacity-90"
        >
          <Plus size={20} />
          Add Vehicle
        </Link>
      </div>

      {/* Table */}

      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr className="text-left">
              <th className="px-6 py-4">Registration</th>
              <th className="px-6 py-4">Vehicle</th>
              <th className="px-6 py-4">Type</th>
              <th className="px-6 py-4">Capacity</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {vehicles.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-10 text-center text-gray-500">
                  No vehicles found.
                </td>
              </tr>
            ) : (
              vehicles.map((vehicle) => (
                <tr
                  key={vehicle.id}
                  className="border-t border-gray-200 hover:bg-gray-50"
                >
                  <td className="px-6 py-4 font-medium">
                    {vehicle.registrationNumber}
                  </td>

                  <td className="px-6 py-4">
                    <div>
                      <p className="font-semibold">{vehicle.name}</p>

                      <p className="text-sm text-gray-500">{vehicle.model}</p>
                    </div>
                  </td>

                  <td className="px-6 py-4">{vehicle.type}</td>

                  <td className="px-6 py-4">{vehicle.maxLoadCapacity} kg</td>

                  <td className="px-6 py-4">
                    <span
                      className={`rounded-full px-3 py-1 text-sm font-medium
                      ${
                        vehicle.status === "AVAILABLE"
                          ? "bg-green-100 text-green-700"
                          : vehicle.status === "ON_TRIP"
                            ? "bg-blue-100 text-blue-700"
                            : vehicle.status === "IN_SHOP"
                              ? "bg-yellow-100 text-yellow-700"
                              : "bg-red-100 text-red-700"
                      }`}
                    >
                      {vehicle.status.replaceAll("_", " ")}
                    </span>
                  </td>

                  <td className="px-6 py-4">
                    <div className="flex justify-center gap-3">
                      <Link
                        href={`/vehicles/${vehicle.id}/edit`}
                        className="rounded-lg bg-secondary p-2 text-white transition hover:opacity-90"
                      >
                        <Pencil size={18} />
                      </Link>

                      <button className="rounded-lg bg-red-500 p-2 text-white transition hover:bg-red-600">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
