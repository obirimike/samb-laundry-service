"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  Sparkles,
  WashingMachine,
  CalendarCheck,
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

export default function ServiceCard({
  service,
  featured = false,
}: ServiceCardProps) {
  const isLaundry = service.category === "LAUNDRY";
  const primaryImageUrl = getServiceImageUrl(
    service.slug,
    service.category,
    service.imageUrl
  );

  const fallbackSvg = isLaundry
    ? "/images/services/laundry-default.svg"
    : "/images/services/cleaning-default.svg";

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
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          onError={() => setImgSrc(fallbackSvg)}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent opacity-80" />

        {/* Category Pill Tag */}
        <div className="absolute top-3.5 left-3.5 flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold tracking-wide shadow-sm backdrop-blur-md transition-colors ${} bg-white/90 text-slate-800">
          {isLaundry ? (
            <WashingMachine size={14} className="text-sky-600" />
          ) : (
            <Sparkles size={14} className="text-blue-600" />
          )}
          <span className="capitalize">
            {isLaundry ? "Laundry Care" : "Cleaning"}
          </span>
        </div>

        {/* Optional Featured / Instant badge */}
        {featured && (
          <div className="absolute top-3.5 right-3.5 rounded-full bg-blue-600 px-2.5 py-0.5 text-[11px] font-semibold text-white shadow">
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
              <CheckCircle2
                size={14}
                className={isLaundry ? "text-sky-600 shrink-0" : "text-blue-600 shrink-0"}
              />
              <span className="truncate">{item}</span>
            </div>
          ))}
        </div>

        {/* Card Actions */}
        <div className="mt-6 flex items-center justify-between gap-3 border-t border-slate-100 pt-4">
          <Link
            href={`/services/${service.slug}`}
            className="inline-flex items-center gap-1 text-xs font-semibold text-slate-700 transition hover:text-blue-600"
          >
            Details
            <ArrowRight size={14} className="transition group-hover:translate-x-0.5" />
          </Link>

          <Link
            href={`/book?service=${service.slug}`}
            className={`inline-flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-bold text-white shadow-sm transition hover:shadow-md ${
              isLaundry
                ? "bg-sky-600 hover:bg-sky-700"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            <CalendarCheck size={14} />
            Book now
          </Link>
        </div>
      </div>
    </article>
  );
}
