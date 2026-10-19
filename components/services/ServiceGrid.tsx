"use client";

import { useState } from "react";
import { Sparkles, WashingMachine, LayoutGrid, Home, Bug } from "lucide-react";
import { ServiceItem, ServiceCategory } from "@/types/service";
import ServiceCard from "./ServiceCard";

type FilterCategory = "ALL" | ServiceCategory;

interface ServiceGridProps {
  services: ServiceItem[];
  enableFilterTabs?: boolean;
  initialFilter?: FilterCategory;
}

export default function ServiceGrid({
  services,
  enableFilterTabs = false,
  initialFilter = "ALL",
}: ServiceGridProps) {
  const [activeFilter, setActiveFilter] = useState<FilterCategory>(initialFilter);

  const filteredServices = services.filter((service) => {
    if (activeFilter === "ALL") return true;
    return service.category === activeFilter;
  });

  const laundryCount = services.filter((s) => s.category === "LAUNDRY").length;
  const cleaningCount = services.filter((s) => s.category === "CLEANING").length;
  const domesticSupportCount = services.filter((s) => s.category === "DOMESTIC_SUPPORT").length;
  const pestControlCount = services.filter((s) => s.category === "PEST_CONTROL").length;

  return (
    <div className="space-y-8">
      {enableFilterTabs && (
        <div className="flex flex-wrap items-center justify-start gap-2 border-b border-slate-200/80 pb-4">
          <button
            type="button"
            onClick={() => setActiveFilter("ALL")}
            aria-pressed={activeFilter === "ALL"}
            className={`inline-flex min-h-11 touch-manipulation items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition ${
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
            onClick={() => setActiveFilter("CLEANING")}
            aria-pressed={activeFilter === "CLEANING"}
            className={`inline-flex min-h-11 touch-manipulation items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition ${
              activeFilter === "CLEANING"
                ? "bg-[#031c43] text-white shadow-sm"
                : "bg-white text-slate-600 hover:bg-slate-100 hover:text-slate-900 border border-slate-200"
            }`}
          >
            <Sparkles size={16} className="text-blue-500" />
            Cleaning Services
            <span className="ml-1 rounded-full bg-blue-100 px-2 py-0.5 text-xs text-blue-800">
              {cleaningCount}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveFilter("LAUNDRY")}
            aria-pressed={activeFilter === "LAUNDRY"}
            className={`inline-flex min-h-11 touch-manipulation items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition ${
              activeFilter === "LAUNDRY"
                ? "bg-[#031c43] text-white shadow-sm"
                : "bg-white text-slate-600 hover:bg-slate-100 hover:text-slate-900 border border-slate-200"
            }`}
          >
            <WashingMachine size={16} className="text-sky-500" />
            Laundry Care
            <span className="ml-1 rounded-full bg-sky-100 px-2 py-0.5 text-xs text-sky-800">
              {laundryCount}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveFilter("DOMESTIC_SUPPORT")}
            aria-pressed={activeFilter === "DOMESTIC_SUPPORT"}
            className={`inline-flex min-h-11 touch-manipulation items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition ${
              activeFilter === "DOMESTIC_SUPPORT"
                ? "bg-[#031c43] text-white shadow-sm"
                : "bg-white text-slate-600 hover:bg-slate-100 hover:text-slate-900 border border-slate-200"
            }`}
          >
            <Home size={16} className="text-emerald-500" />
            Domestic Support
            <span className="ml-1 rounded-full bg-emerald-100 px-2 py-0.5 text-xs text-emerald-800">
              {domesticSupportCount}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveFilter("PEST_CONTROL")}
            aria-pressed={activeFilter === "PEST_CONTROL"}
            className={`inline-flex min-h-11 touch-manipulation items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition ${
              activeFilter === "PEST_CONTROL"
                ? "bg-[#031c43] text-white shadow-sm"
                : "bg-white text-slate-600 hover:bg-slate-100 hover:text-slate-900 border border-slate-200"
            }`}
          >
            <Bug size={16} className="text-amber-500" />
            Pest Control
            <span className="ml-1 rounded-full bg-amber-100 px-2 py-0.5 text-xs text-amber-800">
              {pestControlCount}
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
