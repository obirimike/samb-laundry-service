"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  CheckCircle2,
  Sparkles,
  WashingMachine,
  CalendarCheck,
  Home,
  Bug,
} from "lucide-react";
import { ServiceItem } from "@/types/service";
import {
  getServiceImageUrl,
  getServiceHighlights,
} from "@/lib/services-data";

interface ServiceCardProps {
  service: ServiceItem;
  featured?: boolean;
}

function getCategoryInfo(category: string) {
  switch (category) {
    case "LAUNDRY":
      return {
        label: "Laundry Care",
        icon: <WashingMachine size={14} className="text-sky-600" />,
        fallback: "/images/services/laundry-default.svg",
      };
    case "DOMESTIC_SUPPORT":
      return {
        label: "Domestic Support",
        icon: <Home size={14} className="text-emerald-600" />,
        fallback: "/images/services/domestic-default.svg",
      };
    case "PEST_CONTROL":
      return {
        label: "Pest Control",
        icon: <Bug size={14} className="text-amber-600" />,
        fallback: "/images/services/pest-default.svg",
      };
    case "CLEANING":
    default:
      return {
        label: "Cleaning",
        icon: <Sparkles size={14} className="text-blue-600" />,
        fallback: "/images/services/cleaning-default.svg",
      };
  }
}

export default function ServiceCard({
  service,
  featured = false,
}: ServiceCardProps) {
  const catInfo = getCategoryInfo(service.category);
  const primaryImageUrl = getServiceImageUrl(
    service.slug,
    service.category,
    service.imageUrl
  );

  const [imgSrc, setImgSrc] = useState(primaryImageUrl);
  const highlights = getServiceHighlights(service.slug, service.category);

  return (
    <article
      className={`group flex flex-col overflow-hidden rounded-2xl border bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${
        featured
          ? "border-blue-300 ring-2 ring-blue-500/20 shadow-md"
          : "border-slate-200/90 hover:border-blue-300"
      }`}
    >
      {/* Image Area */}
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-100">
        <Image
          src={imgSrc}
          alt={service.name}
          fill
          loading="lazy"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          onError={() => setImgSrc(catInfo.fallback)}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent opacity-80" />

        {/* Category Pill Tag */}
        <div className="absolute left-3.5 top-3.5 flex items-center gap-1.5 rounded-full bg-white/90 px-3 py-1 text-xs font-bold tracking-wide text-slate-800 shadow-sm backdrop-blur-md">
          {catInfo.icon}
          <span>{catInfo.label}</span>
        </div>

        {/* Optional Featured / Instant badge */}
        {featured && (
          <div className="absolute top-3.5 right-3.5 rounded-full bg-[#031c43] px-2.5 py-0.5 text-[11px] font-semibold text-white shadow">
            Popular
          </div>
        )}

        {/* Title overlay on bottom of image for clear visual punch */}
        <div className="absolute right-4 bottom-3 left-4">
          <h3 className="text-lg font-bold text-white drop-shadow-sm line-clamp-1 sm:text-xl">
            {service.name}
          </h3>
        </div>
      </div>

      {/* Card Content Area */}
      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <p className="min-h-[48px] text-sm leading-relaxed text-slate-600 line-clamp-2">
          {service.description}
        </p>

        {/* Highlights List */}
        <div className="mt-4 space-y-2 border-t border-slate-100 pt-4">
          {highlights.slice(0, 3).map((item, index) => (
            <div
              key={index}
              className="flex items-center gap-2 text-xs font-medium text-slate-600"
            >
              <CheckCircle2 size={14} className="shrink-0 text-emerald-500" />
              <span className="line-clamp-1">{item}</span>
            </div>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="mt-6 flex items-center gap-2 pt-2">
          <Link
            href={`/services/${service.slug}`}
            className="flex-1 rounded-xl border border-slate-200 bg-white py-2.5 text-center text-xs font-bold text-slate-700 transition hover:bg-slate-50 hover:text-slate-900"
          >
            Details
          </Link>

          <Link
            href={`/book?service=${service.id}`}
            className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl bg-[#031c43] py-2.5 text-center text-xs font-bold text-white shadow-sm transition hover:bg-blue-900"
          >
            <CalendarCheck size={14} />
            Book
          </Link>
        </div>
      </div>
    </article>
  );
}
