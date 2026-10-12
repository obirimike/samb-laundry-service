
import Link from "next/link";
import Image from "next/image";
import { Menu } from "lucide-react";

const links = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Our Services" },
  { href: "/about", label: "About Us" },
  { href: "/contact", label: "Contact" },
];

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-3">
          <span className="relative flex h-11 w-11 shrink-0 overflow-hidden rounded-full border border-blue-200 bg-blue-900 shadow-sm">
            <Image
              src="/images/logo/samb-logo.jpeg"
              alt="SAMB's Laundry & Klinin Services Logo"
              fill
              sizes="44px"
              className="object-cover"
              priority
            />
          </span>
          <span>
            <span className="block text-base font-extrabold tracking-tight text-slate-900">
              SAMB&apos;S
            </span>
            <span className="block text-xs font-medium text-slate-500">
              Laundry &amp; Klinin Services
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-7 md:flex" aria-label="Main navigation">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-slate-600 transition hover:text-blue-700"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <Link
            href="/login"
            className="rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-100"
          >
            Sign in
          </Link>
          <Link
            href="/register"
            className="rounded-xl bg-blue-700 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-800"
          >
            Book a Service
          </Link>
        </div>

        <details className="relative md:hidden">
          <summary
            aria-label="Open navigation menu"
            className="flex h-11 w-11 cursor-pointer list-none items-center justify-center rounded-xl border border-slate-200 text-slate-700"
          >
            <Menu size={23} />
          </summary>
          <nav className="absolute right-0 top-14 w-60 rounded-2xl border border-slate-200 bg-white p-3 shadow-xl">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="block rounded-lg px-3 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50 hover:text-blue-700"
              >
                {link.label}
              </Link>
            ))}
            <div className="my-2 border-t border-slate-100" />
            <Link href="/login" className="block rounded-lg px-3 py-3 text-sm font-semibold text-slate-700">
              Sign in
            </Link>
            <Link href="/register" className="block rounded-lg bg-blue-700 px-3 py-3 text-center text-sm font-semibold text-white">
              Book a Service
            </Link>
          </nav>
        </details>
      </div>
    </header>
  );
}
