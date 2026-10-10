
import "next-auth";
import "next-auth/jwt";
import type { DefaultSession } from "next-auth";

type AppUserRole = "CUSTOMER" | "ADMIN";

declare module "next-auth" {
  interface User {
    role: AppUserRole;
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
  }
}
