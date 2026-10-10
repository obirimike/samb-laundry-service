import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 p-6 text-center">
      <h1 className="text-4xl font-bold">Page not found</h1>
      <p className="text-lg text-slate-600">The page you requested does not exist.</p>
      <Link href="/" className="rounded bg-slate-900 px-4 py-2 text-white">
        Go home
      </Link>
    </main>
  );
}
