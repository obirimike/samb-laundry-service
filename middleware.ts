
import NextAuth from "next-auth";
import authConfig from "./lib/auth.config";

const { auth: middleware } = NextAuth(authConfig);

export default middleware;
