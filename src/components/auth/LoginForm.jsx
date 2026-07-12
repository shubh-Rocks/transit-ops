"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from "@/validations/auth.validation";
import Image from "next/image";

const ROLES = [
  {
    value: "FLEET_MANAGER",
    label: "Fleet Manager",
    scope: "Fleet, Maintenance",
  },
  { value: "DRIVER", label: "Driver", scope: "Dashboard, Trips" },
  {
    value: "SAFETY_OFFICER",
    label: "Safety Officer",
    scope: "Drivers, Compliance",
  },
  {
    value: "FINANCIAL_ANALYST",
    label: "Financial Analyst",
    scope: "Fuel & Expenses, Analytics",
  },
];

const MAX_ATTEMPTS = 5;

export default function LoginPage() {
  const router = useRouter();
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [serverError, setServerError] = useState("");

  const isLocked = failedAttempts >= MAX_ATTEMPTS;

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "", role: "FLEET_MANAGER" },
  });

  const selectedRole = watch("role");

  async function onSubmit(data) {
    if (isLocked) return;
    setServerError("");

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        setFailedAttempts((prev) => prev + 1);
        setServerError(result.message || "Invalid credentials.");
        return;
      }

      router.push("/dashboard");
    } catch (error) {
      console.error(error);
      setServerError("Something went wrong. Please try again.");
    }
  }

  return (
    <div className="grid min-h-screen lg:grid-cols-2 p-6 lg:p-20">
      {/* LEFT PANEL - ENHANCED LOGO SECTION */}
      <div className="hidden lg:flex flex-col justify-between p-12 bg-[#F6F4F5] border-[1px] relative overflow-hidden rounded-l-2xl">
        {/* Subtle Background Gradient for extra depth */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#714B67]/5 to-[#017E84]/5 pointer-events-none" />

        {/* Centered Logo Container */}
        <div className="flex-1 flex items-center justify-center">
          <div className="relative group cursor-pointer">
            {/* Subtle Neon Glow Effect behind the logo */}
            <div className="absolute -inset-6 bg-gradient-to-r from-[#714B67] to-[#017E84] opacity-15 blur-2xl rounded-full group-hover:opacity-25 transition-opacity duration-500"></div>

            <Image
              className="relative drop-shadow-xl transition-transform duration-500 group-hover:scale-105"
              src="/transitops_logo.png"
              alt="TransitOps Company Logo"
              width={260} // Increased size
              height={260} // Increased size
              priority // Best practice for LCP elements
            />
          </div>
        </div>

        <p className="text-xs text-[#8F8F8F] relative z-10 text-center">
          TransitOps © 2026 · RBAC enabled
        </p>
      </div>

      {/* RIGHT PANEL - LOGIN FORM */}
      <div className="flex items-center justify-center px-6 py-12 bg-[#1B1420] rounded-r-2xl lg:rounded-l-none rounded-2xl shadow-2xl">
        <div className="w-full max-w-md">
          <h2 className="text-2xl font-semibold text-white">
            Sign in to your account
          </h2>
          <p className="mt-1 text-sm text-[#8F8F8F]">
            Enter your credentials to continue
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-5">
            {/* Email */}
            <div>
              <label className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-[#8F8F8F]">
                Email
              </label>
              <input
                type="email"
                placeholder="raven.k@transitops.in"
                {...register("email")}
                className="w-full rounded-md border border-white/10 bg-white/5 px-3.5 py-2.5 text-sm text-white placeholder-white/30 outline-none focus:border-[#017E84] transition-colors"
              />
              {errors.email && (
                <p className="mt-1 text-xs text-red-500">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-[#8F8F8F]">
                Password
              </label>
              <input
                type="password"
                placeholder="••••••••"
                {...register("password")}
                className="w-full rounded-md border border-white/10 bg-white/5 px-3.5 py-2.5 text-sm text-white placeholder-white/30 outline-none focus:border-[#017E84] transition-colors"
              />
              {errors.password && (
                <p className="mt-1 text-xs text-red-500">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Role */}
            <div>
              <label className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-[#8F8F8F]">
                Role (RBAC)
              </label>
              <select
                {...register("role")}
                className="w-full rounded-md border border-white/10 bg-white/5 px-3.5 py-2.5 text-sm text-white outline-none focus:border-[#017E84] transition-colors appearance-none"
              >
                {ROLES.map((role) => (
                  <option
                    key={role.value}
                    value={role.value}
                    className="bg-[#1B1420]"
                  >
                    {role.label}
                  </option>
                ))}
              </select>
              {errors.role && (
                <p className="mt-1 text-xs text-red-500">
                  {errors.role.message}
                </p>
              )}
            </div>

            {/* Remember & Forgot */}
            <div className="flex items-center justify-between text-sm text-[#8F8F8F]">
              <label className="flex items-center gap-2 cursor-pointer group">
                <input
                  type="checkbox"
                  defaultChecked
                  className="h-4 w-4 rounded border-white/20 bg-white/5 accent-[#017E84] group-hover:border-[#017E84] transition-colors"
                />
                Remember me
              </label>
              <a
                href="/forgot-password"
                className="hover:underline text-[#017E84] transition-all"
              >
                Forgot password?
              </a>
            </div>

            {/* Error Message */}
            {serverError && (
              <div className="rounded-md border border-red-500/40 bg-red-500/10 px-4 py-3">
                <p className="flex items-center gap-1.5 text-sm font-medium text-red-400">
                  <span>✕</span> {serverError}
                </p>
                {isLocked && (
                  <p className="mt-1 text-xs text-red-500/80">
                    Account locked after {MAX_ATTEMPTS} failed attempts.
                  </p>
                )}
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting || isLocked}
              className={`w-full rounded-md py-2.5 text-sm font-medium text-white transition-all shadow-lg ${
                isLocked
                  ? "bg-[#8F8F8F] cursor-not-allowed shadow-none"
                  : "bg-[#714B67] hover:bg-[#5C3C54] hover:shadow-[0_0_15px_rgba(113,75,103,0.4)]"
              } disabled:opacity-50 flex justify-center items-center`}
            >
              {isLocked ? (
                "Account locked"
              ) : isSubmitting ? (
                <span className="flex items-center gap-2">
                  <svg
                    className="animate-spin h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Signing in...
                </span>
              ) : (
                "Sign in"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
