import { z } from "zod";

export const createMaintenanceLogSchema = z.object({
  vehicleId: z.string().trim().min(1, "Vehicle is required"),
  title: z.string().trim().min(1, "Title is required"),
  description: z.string().trim().optional(),
  cost: z.coerce.number().min(0, "Cost must be 0 or greater"),
  startDate: z
    .string()
    .refine((value) => !Number.isNaN(Date.parse(value)), {
      message: "Start date is invalid",
    }),
  status: z.enum(["ACTIVE", "CLOSED"]),
});
