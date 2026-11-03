
import Link from "next/link";
import { redirect } from "next/navigation";

import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import ProfileForm from "@/components/account/ProfileForm";
import ChangePasswordForm from "@/components/account/ChangePasswordForm";

export const dynamic = "force-dynamic";

export default async function ProfilePage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const user = await db.user.findUnique({
    where: {
      id: session.user.id,
    },
    select: {
      name: true,
      email: true,
      phone: true,
    },
  });

  if (!user) {
    redirect("/login");
  }

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 sm:py-12">
      <div className="mx-auto max-w-3xl">
        <Link
          href={
            session.user.role === "ADMIN"
              ? "/admin"
              : session.user.role === "STAFF"
                ? "/staff"
                : "/account"
          }
          className="text-sm font-semibold text-blue-700 hover:underline"
        >
          ← Back to dashboard
        </Link>

        <div className="mt-6">
          <p className="text-sm font-semibold uppercase tracking-wider text-blue-700">
            Account settings
          </p>
          <h1 className="mt-2 text-3xl font-bold text-slate-900">
            Profile settings
          </h1>
          <p className="mt-2 text-slate-600">
            Manage the personal information associated with your SAMB account.
          </p>
        </div>

        <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-8">
          <h2 className="text-lg font-bold text-slate-900">
            Personal information
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Keep your contact details accurate so we can reach you about your
            services.
          </p>

          <div className="mt-7">
            <ProfileForm
              name={user.name}
              email={user.email}
              phone={user.phone ?? ""}
            />
          </div>
        </section>

        <section className="mt-5 rounded-2xl border border-slate-200 bg-white p-5 sm:p-8">
  <h2 className="text-lg font-bold text-slate-900">
    Security
  </h2>

  <p className="mt-1 text-sm text-slate-600">
    Protect your account by keeping your password private and changing
    it whenever necessary.
  </p>

  <ChangePasswordForm />
</section>
      </div>
    </main>
  );
}
