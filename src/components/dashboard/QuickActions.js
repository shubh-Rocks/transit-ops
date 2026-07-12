"use client";

import Link from "next/link";
import { Fuel, Plus, Route, Truck, UserPlus, Wrench } from "lucide-react";
import { useAuth } from "@/provider/AuthProvider";

const actions = [
  {
    title: "Register Vehicle",
    href: "/fleet/new",
    icon: Truck,
    roles: ["FLEET_MANAGER"],
  },
  {
    title: "Add Driver",
    href: "/drivers/new",
    icon: UserPlus,
    roles: ["FLEET_MANAGER", "SAFETY_OFFICER"],
  },
  {
    title: "Create Trip",
    href: "/trips/new",
    icon: Route,
    roles: ["FLEET_MANAGER", "DRIVER"],
  },
  {
    title: "Open Maintenance",
    href: "/maintenance/new",
    icon: Wrench,
    roles: ["FLEET_MANAGER"],
  },
  {
    title: "Log Fuel Cost",
    href: "/fuel-expenses/new",
    icon: Fuel,
    roles: ["FLEET_MANAGER", "FINANCIAL_ANALYST"],
  },
];

export default function QuickActions() {
  const { user } = useAuth();
  const visibleActions = actions.filter((action) =>
    action.roles.includes(user?.role),
  );

  return (
    <section className="rounded-lg border border-[#E6DFE4] bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase text-secondary">
            Quick Actions
          </p>
          <h2 className="mt-1 text-lg font-semibold text-ink">
            Start an operation
          </h2>
        </div>
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <Plus size={19} />
        </div>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
        {visibleActions.map((action) => {
          const Icon = action.icon;

          return (
            <Link
              key={action.title}
              href={action.href}
              className="flex items-center gap-3 rounded-lg border border-[#E6DFE4] bg-surface px-4 py-3 text-sm font-semibold text-ink transition hover:border-secondary/40 hover:bg-white"
            >
              <Icon size={18} className="text-secondary" />
              <span className="truncate">{action.title}</span>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
