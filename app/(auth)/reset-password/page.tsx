
import ResetPasswordForm from "@/components/auth/ResetPasswordForm";

export const metadata = {
  title: "Reset Password | SAMB's Laundry & Cleaning Services",
  description: "Securely reset your SAMB account password.",
};

type ResetPasswordPageProps = {
  searchParams: Promise<{
    token?: string | string[];
  }>;
};

export default async function ResetPasswordPage({
  searchParams,
}: ResetPasswordPageProps) {
  const params = await searchParams;

  const token =
    typeof params.token === "string" ? params.token : "";

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-sm sm:p-8">
        <div className="mb-8 text-center">
          <p className="text-xl font-bold tracking-wide text-gray-900">
            SAMB&apos;S
          </p>

          <p className="mt-1 text-xs text-gray-500">
            Laundry &amp; Klinin Services
          </p>
        </div>

        <ResetPasswordForm token={token} />
      </div>
    </main>
  );
}
