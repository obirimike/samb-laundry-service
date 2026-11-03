
import ForgotPasswordForm from "@/components/auth/ForgotPasswordForm";

export const metadata = {
  title: "Forgot Password | SAMB's Laundry & Cleaning Services",
  description: "Request a secure password reset link for your SAMB account.",
};

export default function ForgotPasswordPage() {
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

        <ForgotPasswordForm />
      </div>
    </main>
  );
}
