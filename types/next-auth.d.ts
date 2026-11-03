import "next-auth";
import "next-auth/jwt";
import type { DefaultSession } from "next-auth";

type AppUserRole = "CUSTOMER" | "ADMIN" | "STAFF";

declare module "next-auth" {
  interface User {
    role: AppUserRole;
    sessionVersion: number;
  }

  interface Session {
    user: {
      id: string;
      role: AppUserRole;
    } & NonNullable<DefaultSession["user"]>;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    role?: AppUserRole;
    sessionVersion?: number;
  }
}