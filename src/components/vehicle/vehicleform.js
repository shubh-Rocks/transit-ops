"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { createVehicleSchema } from "@/validations/vehicle.validation";

export default function VehicleForm({
  defaultValues = {
    registrationNumber: "",
    name: "",
    model: "",
    type: "TRUCK",
    maxLoadCapacity: "",
    odometer: "",
    acquisitionCost: "",
    region: "",
    status: "AVAILABLE",
  },
  isEdit = false,
  vehicleId = "",
}) {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(createVehicleSchema),
    defaultValues,
  });

  async function onSubmit(data) {
    try {
      const url = isEdit ? `/api/vehicles/${vehicleId}` : "/api/vehicles";

      const method = isEdit ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        alert(result.message);
        return;
      }

      alert(
        isEdit
          ? "Vehicle Updated Successfully."
          : "Vehicle Added Successfully.",
      );

      router.push("/vehicles");
      router.refresh();
    } catch (error) {
      console.error(error);
      alert("Something went wrong.");
    }
  }

  return (
    <div className="mx-auto max-w-5xl rounded-2xl bg-white p-8 shadow-sm">
      <h1 className="mb-8 text-3xl font-bold text-primary">
        {isEdit ? "Edit Vehicle" : "Add Vehicle"}
      </h1>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="grid gap-6 md:grid-cols-2"
      >
        {/* Registration */}

        <div>
          <label className="mb-2 block font-medium">Registration Number</label>

          <input
            {...register("registrationNumber")}
            className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-primary"
          />

          <p className="mt-1 text-sm text-red-500">
            {errors.registrationNumber?.message}
          </p>
        </div>

        {/* Name */}

        <div>
          <label className="mb-2 block font-medium">Vehicle Name</label>

          <input
            {...register("name")}
            className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-primary"
          />

          <p className="mt-1 text-sm text-red-500">{errors.name?.message}</p>
        </div>

        {/* Model */}

        <div>
          <label className="mb-2 block font-medium">Model</label>

          <input
            {...register("model")}
            className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-primary"
          />

          <p className="mt-1 text-sm text-red-500">{errors.model?.message}</p>
        </div>

        {/* Type */}

        <div>
          <label className="mb-2 block font-medium">Vehicle Type</label>

          <select
            {...register("type")}
            className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-primary"
          >
            <option value="TRUCK">Truck</option>
            <option value="VAN">Van</option>
            <option value="CAR">Car</option>
            <option value="BIKE">Bike</option>
            <option value="OTHER">Other</option>
          </select>
        </div>

        {/* Capacity */}

        <div>
          <label className="mb-2 block font-medium">
            Maximum Load Capacity
          </label>

          <input
            type="number"
            {...register("maxLoadCapacity")}
            className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-primary"
          />
        </div>

        {/* Odometer */}

        <div>
          <label className="mb-2 block font-medium">Odometer</label>

          <input
            type="number"
            {...register("odometer")}
            className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-primary"
          />
        </div>

        {/* Cost */}

        <div>
          <label className="mb-2 block font-medium">Acquisition Cost</label>

          <input
            type="number"
            {...register("acquisitionCost")}
            className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-primary"
          />
        </div>

        {/* Region */}

        <div>
          <label className="mb-2 block font-medium">Region</label>

          <input
            {...register("region")}
            className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-primary"
          />
        </div>

        {/* Status */}

        <div>
          <label className="mb-2 block font-medium">Status</label>

          <select
            {...register("status")}
            className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-primary"
          >
            <option value="AVAILABLE">Available</option>
            <option value="ON_TRIP">On Trip</option>
            <option value="IN_SHOP">In Shop</option>
            <option value="RETIRED">Retired</option>
          </select>
        </div>

        {/* Submit */}

        <div className="md:col-span-2">
          <button
            disabled={isSubmitting}
            className="w-full rounded-xl bg-primary py-4 font-semibold text-white transition hover:opacity-90 disabled:opacity-50"
          >
            {isSubmitting
              ? "Saving..."
              : isEdit
                ? "Update Vehicle"
                : "Add Vehicle"}
          </button>
        </div>
      </form>
    </div>
  );
}
