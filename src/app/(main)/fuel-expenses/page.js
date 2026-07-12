import prisma from "@/lib/prisma";
import Link from "next/link";

export default async function FuelExpensePage() {
  const [fuelLogs, expenses] = await Promise.all([
    prisma.fuelLog.findMany({
      include: {
        vehicle: true,
      },
      orderBy: {
        date: "desc",
      },
    }),

    prisma.expense.findMany({
      include: {
        vehicle: true,
      },
      orderBy: {
        date: "desc",
      },
    }),
  ]);

  const totalFuelCost = fuelLogs.reduce((sum, item) => sum + item.cost, 0);

  const totalFuelLiters = fuelLogs.reduce((sum, item) => sum + item.liters, 0);

  const totalExpense = expenses.reduce((sum, item) => sum + item.amount, 0);

  const operationalCost = totalFuelCost + totalExpense;

  return (
    <div className="space-y-10">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-primary">Fuel & Expenses</h1>

          <p className="mt-2 text-muted">
            Manage fuel logs and operational expenses
          </p>
        </div>

        <div className="flex gap-4">
          <Link
            href="/fuel/new"
            className="rounded-xl bg-primary px-6 py-3 font-semibold text-white"
          >
            + Log Fuel
          </Link>

          <Link
            href="/expenses/new"
            className="rounded-xl bg-secondary px-6 py-3 font-semibold text-white"
          >
            + Add Expense
          </Link>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-4">
        <div className="rounded-2xl bg-white p-6 shadow">
          <p className="text-muted">Total Fuel Cost</p>

          <h2 className="mt-2 text-3xl font-bold text-primary">
            ₹ {totalFuelCost.toLocaleString()}
          </h2>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow">
          <p className="text-muted">Fuel Consumed</p>

          <h2 className="mt-2 text-3xl font-bold text-secondary">
            {totalFuelLiters} L
          </h2>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow">
          <p className="text-muted">Other Expenses</p>

          <h2 className="mt-2 text-3xl font-bold text-orange-500">
            ₹ {totalExpense.toLocaleString()}
          </h2>
        </div>

        <div className="rounded-2xl bg-primary p-6 text-white shadow">
          <p>Total Operational Cost</p>

          <h2 className="mt-2 text-3xl font-bold">
            ₹ {operationalCost.toLocaleString()}
          </h2>
        </div>
      </div>

      <div className="rounded-2xl bg-white shadow">
        <div className="border-b p-6">
          <h2 className="text-xl font-semibold text-primary">Fuel Logs</h2>
        </div>

        <table className="w-full">
          <thead className="bg-surface">
            <tr>
              <th className="px-6 py-4 text-left">Vehicle</th>

              <th className="px-6 py-4 text-left">Date</th>

              <th className="px-6 py-4 text-left">Liters</th>

              <th className="px-6 py-4 text-left">Fuel Cost</th>
            </tr>
          </thead>

          <tbody>
            {fuelLogs.length === 0 ? (
              <tr>
                <td colSpan={4} className="py-10 text-center">
                  No Fuel Logs Found
                </td>
              </tr>
            ) : (
              fuelLogs.map((fuel) => (
                <tr key={fuel.id} className="border-t hover:bg-surface">
                  <td className="px-6 py-4 font-semibold">
                    {fuel.vehicle.registrationNumber}
                  </td>

                  <td className="px-6 py-4">
                    {fuel.date.toLocaleDateString()}
                  </td>

                  <td className="px-6 py-4">{fuel.liters} L</td>

                  <td className="px-6 py-4 font-semibold">
                    ₹ {fuel.cost.toLocaleString()}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="rounded-2xl bg-white shadow">
        <div className="border-b p-6">
          <h2 className="text-xl font-semibold text-primary">Other Expenses</h2>
        </div>

        <table className="w-full">
          <thead className="bg-surface">
            <tr>
              <th className="px-6 py-4 text-left">Vehicle</th>

              <th className="px-6 py-4 text-left">Type</th>

              <th className="px-6 py-4 text-left">Description</th>

              <th className="px-6 py-4 text-left">Amount</th>
            </tr>
          </thead>

          <tbody>
            {expenses.length === 0 ? (
              <tr>
                <td colSpan={4} className="py-10 text-center">
                  No Expenses Found
                </td>
              </tr>
            ) : (
              expenses.map((expense) => (
                <tr key={expense.id} className="border-t hover:bg-surface">
                  <td className="px-6 py-4 font-semibold">
                    {expense.vehicle.registrationNumber}
                  </td>

                  <td className="px-6 py-4">{expense.type}</td>

                  <td className="px-6 py-4">{expense.description || "-"}</td>

                  <td className="px-6 py-4 font-semibold">
                    ₹ {expense.amount.toLocaleString()}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      {/* Bottom Summary */}

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="rounded-2xl bg-white p-6 shadow">
          <p className="text-sm text-muted">Fuel Cost</p>

          <h2 className="mt-3 text-3xl font-bold text-primary">
            ₹ {totalFuelCost.toLocaleString()}
          </h2>

          <div className="mt-5 h-3 rounded-full bg-surface">
            <div
              className="h-full rounded-full bg-primary"
              style={{
                width: `${
                  operationalCost === 0
                    ? 0
                    : (totalFuelCost / operationalCost) * 100
                }%`,
              }}
            />
          </div>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow">
          <p className="text-sm text-muted">Other Expenses</p>

          <h2 className="mt-3 text-3xl font-bold text-secondary">
            ₹ {totalExpense.toLocaleString()}
          </h2>

          <div className="mt-5 h-3 rounded-full bg-surface">
            <div
              className="h-full rounded-full bg-secondary"
              style={{
                width: `${
                  operationalCost === 0
                    ? 0
                    : (totalExpense / operationalCost) * 100
                }%`,
              }}
            />
          </div>
        </div>

        <div className="rounded-2xl bg-primary p-6 text-white shadow">
          <p className="text-sm">Total Operational Cost</p>

          <h2 className="mt-3 text-4xl font-bold">
            ₹ {operationalCost.toLocaleString()}
          </h2>

          <p className="mt-3 text-sm opacity-80">Fuel + Expenses</p>
        </div>
      </div>

      {/* Recent Fuel Logs */}

      <div className="rounded-2xl bg-white p-6 shadow">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-primary">
            Recent Fuel Activity
          </h2>

          <Link
            href="/fuel/new"
            className="rounded-lg bg-primary px-4 py-2 text-white"
          >
            Add Fuel
          </Link>
        </div>

        <div className="space-y-4">
          {fuelLogs.slice(0, 5).map((fuel) => (
            <div
              key={fuel.id}
              className="flex items-center justify-between rounded-xl border p-4"
            >
              <div>
                <h3 className="font-semibold">
                  {fuel.vehicle.registrationNumber}
                </h3>

                <p className="text-sm text-muted">
                  {fuel.date.toLocaleDateString()}
                </p>
              </div>

              <div className="text-right">
                <p className="font-semibold">{fuel.liters} L</p>

                <p className="text-primary font-semibold">₹ {fuel.cost}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Expenses */}

      <div className="rounded-2xl bg-white p-6 shadow">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-primary">
            Recent Expenses
          </h2>

          <Link
            href="/expenses/new"
            className="rounded-lg bg-secondary px-4 py-2 text-white"
          >
            Add Expense
          </Link>
        </div>

        <div className="space-y-4">
          {expenses.slice(0, 5).map((expense) => (
            <div
              key={expense.id}
              className="flex items-center justify-between rounded-xl border p-4"
            >
              <div>
                <h3 className="font-semibold">
                  {expense.vehicle.registrationNumber}
                </h3>

                <p className="text-sm text-muted">{expense.type}</p>
              </div>

              <div className="text-right">
                <p className="font-semibold text-primary">₹ {expense.amount}</p>

                <p className="text-sm text-muted">
                  {expense.description || "-"}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
