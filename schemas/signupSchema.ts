import { email, z } from "zod";

export const usernameValidation = z
  .string()
  .min(2, "username should atleast be of 2 characters")
  .max(30, "username should not be longer than 30 charactes")
  .regex(/^[a-zA-Z0-9_]+$/, "username should not contain special character");

export const signupSchema = z.object({
  username: usernameValidation,
  email: z.string().email({ message: "invalid email address" }),
  password: z.string().min(6, "password should atleast be of 6 digits"),
});
