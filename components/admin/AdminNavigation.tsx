"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BadgeDollarSign,
  BriefcaseBusiness,
  CalendarDays,
  ClipboardList,
  LayoutDashboard,
  Star,
  UserCheck,
  UserPlus,
  Users,
} from "lucide-react";

const navigationItems = [
  { href: "/admin", label: "Overview", icon: LayoutDashboard },
  { href: "/admin/bookings", label: "Bookings", icon: ClipboardList },
  { href: "/admin/assignments", label: "Assignments", icon: UserPlus },
  { href: "/admin/staff", label: "Staff", icon: UserCheck },
  { href: "/admin/calendar", label: "Booking calendar", icon: CalendarDays },
  { href: "/admin/customers", label: "Customers", icon: Users },
  { href: "/admin/services", label: "Services", icon: BriefcaseBusiness },
  { href: "/admin/quotes", label: "Quotes & pricing", icon: BadgeDollarSign },
  { href: "/admin/reviews", label: "Reviews", icon: Star },
];

export default function AdminNavigation() {
  const pathname = usePathname();

  return (
    <aside className="border-b border-slate-200 bg-white px-4 py-4 lg:sticky lg:top-0 lg:h-screen lg:w-64 lg:shrink-0 lg:border-b-0 lg:border-r lg:px-5 lg:py-8">
      <div className="mb-4 lg:mb-10">
        <p className="text-base font-extrabold tracking-tight text-slate-900">
          SAMB&apos;S
        </p>
        <p className="text-xs font-medium text-slate-500">
          Laundry management
        </p>
      </div>

      <nav aria-label="Admin navigation">
        <p className="mb-3 hidden px-3 text-xs font-bold uppercase tracking-wider text-slate-400 lg:block">
          Workspace
        </p>
        <ul className="flex gap-2 overflow-x-auto pb-1 lg:flex-col lg:overflow-visible lg:pb-0">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              item.href === "/admin"
                ? pathname === item.href
                : pathname === item.href || pathname.startsWith(`${item.href}/`);

            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={isActive ? "page" : undefined}
                  className={`flex shrink-0 items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition-colors lg:w-full ${
                    isActive
                      ? "bg-blue-50 text-blue-800"
                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                  }`}
                >
                  <Icon size={18} aria-hidden="true" />
                  <span>{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
}
