
import { Suspense } from "react";
import LoginForm from "@/components/LoginForm";

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <main className="flex min-h-screen items-center justify-center">
          <p>Loading login form...</p>
        </main>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
