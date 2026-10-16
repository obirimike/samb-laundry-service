"use client";

import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="bg-slate-950 text-slate-300">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-3 lg:px-8">
        <div>
          <Link href="/" className="inline-flex items-center gap-3 text-white">
            <span className="relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full border border-white/20 bg-blue-950">
              <Image
                src="/images/logo/samb-logo.jpeg"
                alt="SAMB's Services Logo"
                fill
                loading="lazy"
                sizes="40px"
                className="object-cover"
              />
            </span>
            <span className="font-bold tracking-tight">SAMB&apos;S SERVICES</span>
          </Link>
          <p className="mt-4 max-w-sm text-sm leading-6 text-slate-400">
            Professional cleaning solutions with expanding laundry services.
            Helping homes and workplaces feel cleaner, fresher, and more comfortable.
          </p>
        </div>

        <div>
          <h2 className="font-semibold text-white">Explore</h2>
          <ul className="mt-4 space-y-3 text-sm">
            <li><Link href="/" className="hover:text-white">Home</Link></li>
            <li><Link href="/services" className="hover:text-white">Our Services</Link></li>
            <li><Link href="/about" className="hover:text-white">About Us</Link></li>
            <li><Link href="/contact" className="hover:text-white">Contact Us</Link></li>
          </ul>
        </div>

        <div>
          <h2 className="font-semibold text-white">Customer account</h2>
          <ul className="mt-4 space-y-3 text-sm">
            <li><Link href="/register" className="hover:text-white">Create an account</Link></li>
            <li><Link href="/login" className="hover:text-white">Sign in</Link></li>
            <li><Link href="/services" className="hover:text-white">Request a service</Link></li>
          </ul>
          <p className="mt-5 text-xs leading-5 text-slate-500">
            Service prices are discussed according to the type and scope of work.
          </p>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto max-w-7xl px-4 py-5 text-xs text-slate-500 sm:px-6 lg:px-8">
          © <span suppressHydrationWarning>{new Date().getFullYear()}</span> SAMB&apos;s Laundry and Klinin Services. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
