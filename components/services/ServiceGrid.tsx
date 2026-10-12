"use client";

import { useState } from "react";
import { Sparkles, WashingMachine, LayoutGrid } from "lucide-react";
import { ServiceItem } from "@/types/service";
import ServiceCard from "./ServiceCard";

interface ServiceGridProps {
  services: ServiceItem[];
  enableFilterTabs?: boolean;
  initialFilter?: "ALL" | "LAUNDRY" | "CLEANING";
}

export default function ServiceGrid({
  services,
  enableFilterTabs = false,
  initialFilter = "ALL",
}: ServiceGridProps) {
  const [activeFilter, setActiveFilter] = useState<"ALL" | "LAUNDRY" | "CLEANING">(
    initialFilter
  );

  const filteredServices = services.filter((service) => {
    if (activeFilter === "ALL") return true;
    return service.category === activeFilter;
  });

  const laundryCount = services.filter((s) => s.category === "LAUNDRY").length;
  const cleaningCount = services.filter((s) => s.category === "CLEANING").length;

  return (
    <div className="space-y-8">
      {enableFilterTabs && (
        <div className="flex flex-wrap items-center justify-start gap-2 border-b border-slate-200/80 pb-4">
          <button
            type="button"
            onClick={() => setActiveFilter("ALL")}
            className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition ${
              activeFilter === "ALL"
                ? "bg-slate-900 text-white shadow-sm"
                : "bg-white text-slate-600 hover:bg-slate-100 hover:text-slate-900 border border-slate-200"
            }`}
          >
            <LayoutGrid size={16} />
            All Services
            <span className="ml-1 rounded-full bg-slate-200/50 px-2 py-0.5 text-xs text-slate-700">
              {services.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveFilter("LAUNDRY")}
            className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition ${
              activeFilter === "LAUNDRY"
                ? "bg-sky-600 text-white shadow-sm"
                : "bg-white text-slate-600 hover:bg-slate-100 hover:text-slate-900 border border-slate-200"
            }`}
          >
            <WashingMachine size={16} />
            Laundry Care
            <span className="ml-1 rounded-full bg-sky-100 px-2 py-0.5 text-xs text-sky-800">
              {laundryCount}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveFilter("CLEANING")}
            className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition ${
              activeFilter === "CLEANING"
                ? "bg-blue-600 text-white shadow-sm"
                : "bg-white text-slate-600 hover:bg-slate-100 hover:text-slate-900 border border-slate-200"
            }`}
          >
            <Sparkles size={16} />
            Cleaning Services
            <span className="ml-1 rounded-full bg-blue-100 px-2 py-0.5 text-xs text-blue-800">
              {cleaningCount}
            </span>
          </button>
        </div>
      )}

      {filteredServices.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredServices.map((service) => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center">
          <p className="text-base font-semibold text-slate-700">
            No services found in this category.
          </p>
          <p className="mt-1 text-sm text-slate-500">
            Please select another category or check back soon.
          </p>
        </div>
      )}
    </div>
  );
}
