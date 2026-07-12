"use client";

import { Bell, LogOut, Menu, Search } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/provider/AuthProvider";

const pageTitles = {
  "/dashboard": {
    title: "Operations Dashboard",
    description: "Live fleet, dispatch, maintenance, and cost visibility.",
  },
  "/fleet": {
    title: "Fleet Registry",
    description: "Vehicle lifecycle and asset availability.",
  },
  "/drivers": {
    title: "Driver Management",
    description: "Compliance, duty status, and safety score tracking.",
  },
  "/trips": {
    title: "Trip Dispatch",
    description: "Draft, dispatch, complete, and cancel transport jobs.",
  },
  "/maintenance": {
    title: "Maintenance",
    description: "Workshop status and active service logs.",
  },
  "/fuel-expenses": {
    title: "Fuel & Expenses",
    description: "Fuel, tolls, maintenance costs, and operating spend.",
  },
  "/analytics": {
    title: "Reports & Analytics",
    description: "Efficiency, utilization, costs, and ROI insights.",
  },
  "/settings": {
    title: "Settings",
    description: "Workspace preferences and account controls.",
  },
};

function getPageMeta(pathname) {
  const match = Object.entries(pageTitles).find(([href]) => {
    return pathname === href || pathname.startsWith(`${href}/`);
  });

  return match?.[1] ?? pageTitles["/dashboard"];
}

function formatRole(role) {
  return role?.replaceAll("_", " ") ?? "Loading";
}

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const page = getPageMeta(pathname);

  async function handleLogout() {
    await logout();
    router.replace("/login");
  }

  return (
    <header className="sticky top-0 z-20 border-b border-[#E6DFE4] bg-white/95 px-4 py-4 backdrop-blur md:px-6">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        <div className="flex items-start gap-3">
          <button
            type="button"
            aria-label="Open navigation"
            className="mt-1 flex h-10 w-10 items-center justify-center rounded-lg border border-[#E6DFE4] text-ink lg:hidden"
          >
            <Menu size={19} />
          </button>
          <div>
            <p className="text-xs font-semibold uppercase text-secondary">
              TransitOps Command Center
            </p>
            <h1 className="mt-1 text-2xl font-semibold text-ink">
              {page.title}
            </h1>
            <p className="mt-1 text-sm text-muted">{page.description}</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="relative min-w-0 flex-1 md:w-80 md:flex-none">
            <Search
              size={17}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted"
            />
            <input
              type="search"
              placeholder="Search fleet, trips, drivers..."
              className="h-11 w-full rounded-lg border border-[#E6DFE4] bg-surface pl-10 pr-3 text-sm text-ink outline-none transition focus:border-secondary focus:bg-white"
            />
          </div>

          <button
            type="button"
            aria-label="Notifications"
            className="flex h-11 w-11 items-center justify-center rounded-lg border border-[#E6DFE4] bg-white text-ink transition hover:border-secondary/40"
          >
            <Bell size={18} />
          </button>

          <div className="flex h-11 items-center gap-3 rounded-lg border border-[#E6DFE4] bg-white px-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-sm font-semibold text-white">
              {user?.name?.charAt(0).toUpperCase() ?? "T"}
            </div>
            <div className="hidden min-w-32 md:block">
              <p className="truncate text-sm font-semibold text-ink">
                {user?.name ?? "TransitOps User"}
              </p>
              <p className="truncate text-xs text-muted">
                {formatRole(user?.role)}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className="flex h-11 items-center gap-2 rounded-lg bg-primary px-4 text-sm font-semibold text-white transition hover:bg-[#5C3C54]"
          >
            <LogOut size={17} />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </div>
    </header>
  );
}
