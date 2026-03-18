import { z } from "zod";

export const messageSchema = z.object({
  message: z
    .string()
    .min(10, "message should atleast be of 10 characters")
    .max(300, "message length should not exceed 300 characters"),
});
