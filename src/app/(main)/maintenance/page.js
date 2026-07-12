"use client";

import { useEffect, useState } from "react";

const initialFormState = {
  vehicleId: "",
  title: "",
  description: "",
  cost: "",
  startDate: new Date().toISOString().split("T")[0],
  status: "ACTIVE",
};

export default function MaintenancePage() {
  const [maintenanceLogs, setMaintenanceLogs] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [formData, setFormData] = useState(initialFormState);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    fetchVehicles();
    fetchMaintenanceLogs();
  }, []);

  const fetchVehicles = async () => {
    setError("");
    try {
      const res = await fetch("/api/vehicles");
      if (!res.ok) throw new Error("Failed to fetch vehicles");
      const data = await res.json();
      setVehicles(Array.isArray(data?.vehicles) ? data.vehicles : []);
    } catch (err) {
      console.error(err);
      setError("Unable to load vehicles. Please refresh the page.");
      setVehicles([]);
    }
  };

  const fetchMaintenanceLogs = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/maintenance");
      if (!res.ok) throw new Error("Failed to fetch maintenance logs");
      const data = await res.json();
      setMaintenanceLogs(Array.isArray(data?.maintenanceLogs) ? data.maintenanceLogs : []);
    } catch (err) {
      console.error(err);
      setError("Failed to load maintenance records.");
      setMaintenanceLogs([]);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSuccessMessage("");
    if (!formData.vehicleId || !formData.title || formData.cost === "") {
      setError("Please fill in all required fields.");
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch("/api/maintenance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, cost: Number(formData.cost) }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data?.message || "Failed to create maintenance record.");
        return;
      }
      setSuccessMessage(data?.message || "Maintenance record created successfully.");
      setFormData({ ...initialFormState, startDate: new Date().toISOString().split("T")[0] });
      fetchMaintenanceLogs();
    } catch (err) {
      console.error(err);
      setError("Something went wrong while saving the record.");
    } finally {
      setSubmitting(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-surface text-ink p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2 text-primary">Maintenance & Service Records</h1>
          <p className="text-sm text-muted max-w-2xl">Track every service entry and expenses for your fleet vehicles.</p>
        </div>
        {error ? (
          <div className="mb-6 rounded-2xl border border-primary-soft bg-primary-soft px-5 py-4 text-sm text-primary">{error}</div>
        ) : null}
        {successMessage ? (
          <div className="mb-6 rounded-2xl border border-primary-soft bg-primary-soft px-5 py-4 text-sm text-primary">{successMessage}</div>
        ) : null}
        <div className="grid gap-8 lg:grid-cols-2">
          <section className="rounded-3xl border border-muted bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold mb-6 text-primary-dark">Log New Service Record</h2>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-3">
                <label className="block text-sm font-medium text-ink">Vehicle</label>
                <select
                  name="vehicleId"
                  value={formData.vehicleId}
                  onChange={handleChange}
                  className="w-full rounded-2xl border border-muted bg-surface px-4 py-3 text-ink focus:outline-none focus:border-primary"
                  required
                >
                  <option value="">Select a vehicle</option>
                  {vehicles.map((vehicle) => (
                    <option key={vehicle.id} value={vehicle.id}>
                      {vehicle.registrationNumber} — {vehicle.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-3">
                <label className="block text-sm font-medium text-ink">Service Title</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full rounded-2xl border border-muted bg-surface px-4 py-3 text-ink focus:outline-none focus:border-primary"
                  placeholder="Oil change, brake service, etc."
                  required
                />
              </div>
              <div className="space-y-3">
                <label className="block text-sm font-medium text-ink">Service Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={4}
                  className="w-full rounded-2xl border border-muted bg-surface px-4 py-3 text-ink focus:outline-none focus:border-primary"
                  placeholder="Add any details about the maintenance task."
                />
              </div>
              <div className="grid gap-5 sm:grid-cols-2">
                <div className="space-y-3">
                  <label className="block text-sm font-medium text-ink">Cost (₹)</label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    name="cost"
                    value={formData.cost}
                    onChange={handleChange}
                    className="w-full rounded-2xl border border-muted bg-surface px-4 py-3 text-ink focus:outline-none focus:border-primary"
                    placeholder="0.00"
                    required
                  />
                </div>
                <div className="space-y-3">
                  <label className="block text-sm font-medium text-ink">Start Date</label>
                  <input
                    type="date"
                    name="startDate"
                    value={formData.startDate}
                    onChange={handleChange}
                    className="w-full rounded-2xl border border-muted bg-surface px-4 py-3 text-ink focus:outline-none focus:border-primary"
                    required
                  />
                </div>
              </div>
              <div className="space-y-3">
                <label className="block text-sm font-medium text-ink">Status</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full rounded-2xl border border-muted bg-surface px-4 py-3 text-ink focus:outline-none focus:border-primary"
                >
                  <option value="ACTIVE">ACTIVE</option>
                  <option value="CLOSED">CLOSED</option>
                </select>
              </div>
              <button
                type="submit"
                disabled={submitting}
                className="w-full rounded-2xl bg-primary px-5 py-3 text-sm font-semibold text-white transition hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-70"
              >
                {submitting ? "Saving..." : "Save Service Record"}
              </button>
            </form>
          </section>
          <section className="rounded-3xl border border-muted bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold mb-6 text-primary-dark">Service Log</h2>
            {loading ? (
              <p className="text-muted">Loading records...</p>
            ) : maintenanceLogs.length === 0 ? (
              <div className="rounded-2xl border border-muted bg-surface p-6 text-center text-muted">
                No maintenance records found.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full table-auto text-left">
                  <thead>
                    <tr className="border-b border-muted text-sm uppercase tracking-wide text-muted">
                      <th className="py-3 pr-6">Vehicle</th>
                      <th className="py-3 pr-6">Service</th>
                      <th className="py-3 pr-6 text-right">Cost</th>
                      <th className="py-3 pr-6 text-center">Date</th>
                      <th className="py-3 text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {maintenanceLogs.map((log) => (
                      <tr key={log.id} className="border-b border-muted hover:bg-surface">
                        <td className="py-4 pr-6 font-medium text-ink">{log.vehicle?.registrationNumber || "N/A"}</td>
                        <td className="py-4 pr-6 text-ink">{log.title}</td>
                        <td className="py-4 pr-6 text-right font-semibold text-primary">₹{Number(log.cost).toLocaleString("en-IN")}</td>
                        <td className="py-4 pr-6 text-center text-sm text-muted">{formatDate(log.startDate)}</td>
                        <td className="py-4 text-center">
                          <span className={log.status === "ACTIVE" ? "inline-flex rounded-full px-3 py-1 text-xs font-semibold text-white bg-secondary" : "inline-flex rounded-full px-3 py-1 text-xs font-semibold text-white bg-primary"}>
                            {log.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}