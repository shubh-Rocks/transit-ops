"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  Fuel,
  LayoutDashboard,
  Route,
  Settings,
  ShieldCheck,
  Truck,
  Users,
  Wrench,
} from "lucide-react";
import { useAuth } from "@/provider/AuthProvider";

const menuItems = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
    roles: ["FLEET_MANAGER", "DRIVER", "SAFETY_OFFICER", "FINANCIAL_ANALYST"],
  },
  {
    title: "Fleet Registry",
    href: "/fleet",
    icon: Truck,
    roles: ["FLEET_MANAGER"],
  },
  {
    title: "Drivers",
    href: "/drivers",
    icon: Users,
    roles: ["FLEET_MANAGER", "SAFETY_OFFICER"],
  },
  {
    title: "Trips",
    href: "/trips",
    icon: Route,
    roles: ["FLEET_MANAGER", "DRIVER"],
  },
  {
    title: "Maintenance",
    href: "/maintenance",
    icon: Wrench,
    roles: ["FLEET_MANAGER"],
  },
  {
    title: "Fuel & Expenses",
    href: "/fuel-expenses",
    icon: Fuel,
    roles: ["FLEET_MANAGER", "FINANCIAL_ANALYST"],
  },
  {
    title: "Analytics",
    href: "/analytics",
    icon: BarChart3,
    roles: ["FLEET_MANAGER", "FINANCIAL_ANALYST"],
  },
  {
    title: "Settings",
    href: "/settings",
    icon: Settings,
    roles: ["FLEET_MANAGER"],
  },
];

function formatRole(role) {
  return role?.replaceAll("_", " ") ?? "Loading";
}

export default function Sidebar() {
  const pathname = usePathname();
  const { user, loading } = useAuth();

  const visibleItems = menuItems.filter((item) => {
    if (loading) return item.href === "/dashboard";
    return item.roles.includes(user?.role);
  });

  return (
    <aside className="sticky top-0 hidden h-screen w-72 shrink-0 flex-col border-r border-white/10 bg-primary-dark text-white lg:flex">
      <div className="flex h-20 items-center gap-3 border-b border-white/10 px-6">
        <Image
          src="/transitops_logo.png"
          alt="TransitOps"
          width={42}
          height={42}
          className="rounded-lg bg-white p-1"
        />
        <div className="min-w-0">
          <h1 className="truncate text-lg font-semibold">TransitOps</h1>
          <p className="truncate text-xs text-white/55">
            Smart Transport Operations
          </p>
        </div>
      </div>

      <div className="border-b border-white/10 px-6 py-5">
        <p className="text-xs font-semibold uppercase text-white/45">
          Workspace
        </p>
        <div className="mt-3 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary text-sm font-semibold text-white">
            {user?.name?.charAt(0).toUpperCase() ?? "T"}
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-medium">
              {user?.name ?? "TransitOps User"}
            </p>
            <p className="truncate text-xs text-white/50">
              {formatRole(user?.role)}
            </p>
          </div>
        </div>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto px-4 py-5">
        {visibleItems.map((item) => {
          const Icon = item.icon;
          const active =
            pathname === item.href || pathname.startsWith(`${item.href}/`);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition ${
                active
                  ? "bg-white text-primary-dark shadow-sm"
                  : "text-white/68 hover:bg-white/8 hover:text-white"
              }`}
            >
              <Icon size={19} />
              <span className="truncate">{item.title}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
