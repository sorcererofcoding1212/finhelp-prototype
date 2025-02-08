import { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import prisma from "./db";
import bcrypt from "bcrypt";

export const NEXTAUTH_CONFIG: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", placeholder: "Email", type: "email" },
        password: {
          label: "Password",
          placeholder: "Password",
          type: "password",
        },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Credentials missing");
        }
        const { email, password } = credentials;
        const userDetails = await prisma.user.findUnique({
          where: {
            email,
          },
          select: {
            id: true,
            password: true,
            name: true,
          },
        });
        if (!userDetails) {
          throw new Error("Invalid credentials");
        }
        const isPasswordValid = await bcrypt.compare(
          password,
          userDetails.password
        );
        if (!isPasswordValid) {
          throw new Error("Invalid credentials");
        }
        const user = {
          name: userDetails.name,
          id: userDetails.id,
          email: email,
        };
        return user;
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/auth",
  },
};
