"use client";

import Link from "next/link";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import SignOutButton from "@/components/auth/SignOutButton";

type MobileNavigationMenuProps = {
  links: Array<{ href: string; label: string }>;
  isSignedIn: boolean;
  isStaff: boolean;
  isAdmin: boolean;
  dashboardHref: string;
  dashboardLabel: string;
  bookingHref: string;
  bookingLabel: string;
};

export default function MobileNavigationMenu({
  links,
  isSignedIn,
  isStaff,
  isAdmin,
  dashboardHref,
  dashboardLabel,
  bookingHref,
  bookingLabel,
}: MobileNavigationMenuProps) {
  const [isOpen, setIsOpen] = useState(false);

  const closeMenu = () => setIsOpen(false);

  return (
    <div className="relative md:hidden">
      <button
        type="button"
        aria-label={isOpen ? "Close navigation menu" : "Open navigation menu"}
        aria-expanded={isOpen}
        aria-controls="mobile-navigation"
        onClick={() => setIsOpen((current) => !current)}
        className="flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 text-slate-700 transition hover:bg-slate-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
      >
        {isOpen ? <X size={22} aria-hidden="true" /> : <Menu size={22} aria-hidden="true" />}
      </button>

      {isOpen && (
        <div
          id="mobile-navigation"
          className="absolute right-0 top-14 w-[min(88vw,20rem)] rounded-2xl border border-slate-200 bg-white p-3 shadow-xl"
        >
          <div className="mb-2 flex items-center justify-end px-1">
            <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-slate-400">
              Menu
            </span>
          </div>

          <div className="space-y-1">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={closeMenu}
                className="block rounded-lg px-3 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50 hover:text-blue-700"
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="my-3 border-t border-slate-100" />

          <div className="space-y-2">
            {isStaff ? (
              <Link
                href="/staff"
                onClick={closeMenu}
                className="block rounded-xl bg-[#031c43] px-3 py-3 text-center text-sm font-semibold text-white transition hover:bg-blue-800"
              >
                Staff Dashboard
              </Link>
            ) : isSignedIn ? (
              <>
                <Link
                  href={dashboardHref}
                  onClick={closeMenu}
                  className="block rounded-xl border border-slate-200 px-3 py-3 text-center text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                >
                  {dashboardLabel}
                </Link>
                <Link
                  href={bookingHref}
                  onClick={closeMenu}
                  className="block rounded-xl bg-[#031c43] px-3 py-3 text-center text-sm font-semibold text-white transition hover:bg-blue-800"
                >
                  {bookingLabel}
                </Link>
              </>
            ) : (
              <>
                <Link
                  href="/register"
                  onClick={closeMenu}
                  className="block rounded-xl border border-slate-200 px-3 py-3 text-center text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                >
                  Create Account
                </Link>
                <Link
                  href={bookingHref}
                  onClick={closeMenu}
                  className="block rounded-xl bg-[#031c43] px-3 py-3 text-center text-sm font-semibold text-white transition hover:bg-blue-800"
                >
                  {bookingLabel}
                </Link>
              </>
            )}
          </div>

          {!isAdmin && isSignedIn && (
            <div className="mt-3 border-t border-slate-100 pt-3">
              <SignOutButton className="w-full justify-center rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-100" />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
