import { z } from "zod";

export const createVehicleSchema = z.object({
  registrationNumber: z
    .string()
    .trim()
    .min(1, "Registration number is required")
    .max(20, "Registration number is too long"),

  name: z.string().trim().min(2, "Vehicle name is required").max(100),

  model: z.string().trim().min(1, "Model is required"),

  type: z.enum(["TRUCK", "VAN", "BIKE", "CAR", "OTHER"]),

  maxLoadCapacity: z.coerce
    .number()
    .positive("Capacity must be greater than 0"),

  odometer: z.coerce.number().min(0, "Odometer cannot be negative"),

  acquisitionCost: z.coerce.number().positive("Acquisition cost is required"),

  region: z.string().trim().optional(),

  status: z.enum(["AVAILABLE", "ON_TRIP", "IN_SHOP", "RETIRED"]),
});
