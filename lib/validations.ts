import { z } from "zod";

// these are the validation properties for the sign-up form (i.e. fluent validations in C#)
export const signUpSchema = z.object({
  fullName: z.string().min(3),
  email: z.string().email(),
  universityId: z.coerce.number(),
  universityCard: z.string().nonempty("University Card is required"),
  password: z.string().min(8),
});

// these are the validation properties for the sign-in form (i.e. fluent validations)
export const signInSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});
