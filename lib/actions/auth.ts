"use server";

import { db } from "@/database/drizzle";
import { users } from "@/database/schema";
import { hash } from "bcryptjs";
import { eq } from "drizzle-orm";
import { signIn } from "@/auth";

export const signInWithCredentials = async (
  // we don't want to accept all the credentials so we make use of Pick<>
  // which allows us to pick which parameters we want to use
  params: Pick<AuthCredentials, "email" | "password">,
) => {
  const { email, password } = params;

  try {
    // sign the user in
    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    // if there are any errors we return with the error
    if (result?.error) {
      return { success: false, error: result.error };
    }

    // otherwise we continue
    return { success: true };
  } catch (e) {
    console.log(e, "Signin Error");
    return { success: false, error: "Signin Error" };
  }
};
export const signUp = async (params: AuthCredentials) => {
  const { fullName, email, universityId, password, universityCard } = params;

  // we check if the user already exists
  const existingUser = await db
    .select()
    .from(users)
    .where(eq(users.email, email))
    .limit(1);

  // user profile does already exist so we return
  if (existingUser.length > 0) {
    return { success: false, error: "User already exists" };
  }

  // user does not exist, so we create them
  const hashedPassword = await hash(password, 10);

  try {
    // create
    await db.insert(users).values({
      fullName,
      email,
      universityId,
      password,
      universityCard,
    });

    // auto sign in user
    await signInWithCredentials({ email, password });

    return { success: true };
  } catch (e) {
    console.log(e, "Signup error");
    return { success: false, error: "Signup error" };
  }
};
