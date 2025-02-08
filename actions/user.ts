"use server";

import { NEXTAUTH_CONFIG } from "@/lib/auth";
import prisma from "@/lib/db";
import bcrypt from "bcrypt";
import { getServerSession } from "next-auth";
import { FieldValues } from "react-hook-form";

export async function userSignup(data: FieldValues) {
  try {
    const { name, email, password } = data;
    const finalName = name
      .split(" ")
      .map(
        (word: string) =>
          word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
      )
      .join(" ");
    if (!name || !email || !password) {
      return {
        msg: "Invalid inputs",
        success: false,
      };
    }
    const existingUser = await prisma.user.findUnique({
      where: {
        email,
      },
    });
    if (existingUser) {
      return {
        msg: "User with that email already exists",
        success: false,
      };
    }
    const encryptedPassword = await bcrypt.hash(password, 10);
    await prisma.user.create({
      data: {
        name: finalName,
        email,
        password: encryptedPassword,
      },
    });
    return {
      msg: "User created",
      success: true,
    };
  } catch (error: any) {
    console.log(error.msg || error, "SIGNUP_ERROR");
    return {
      msg: "Internal server error",
      success: false,
    };
  }
}

export async function getUser() {
  try {
    const session = await getServerSession(NEXTAUTH_CONFIG);
    return session;
  } catch (error: any) {
    console.log(error.msg || error, "GET_USER_ERROR");
  }
}
