import { z } from "zod";

export const usernameSchema = z.object({
  username: z
    .string()
    .trim()
    .min(3, "Username must be at least 3 characters.")
    .max(30, "Username must be at most 30 characters.")
    .regex(
      /^[A-Za-z0-9_]+$/,
      "Username can only contain letters, numbers, and underscores.",
    ),
});

export const loginSchema = z.object({
  usernameOrEmail: z
    .string()
    .trim()
    .min(1, "Please enter your username or email.")
    .superRefine((val, ctx) => {
      if (val.includes("@")) {
        if (!z.string().email().safeParse(val).success) {
          ctx.addIssue({
            code: "custom",
            message: "Please enter a valid email.",
          });
        }
      } else {
        // Validate against the object schema by wrapping the value
        const result = usernameSchema.safeParse({ username: val });
        if (!result.success) {
          ctx.addIssue({
            code: "custom",
            message: result.error.issues[0]?.message ?? "Invalid username",
          });
        }
      }
    }),
  password: z.string().min(1, "Password is required."),
});

export const registerSchema = z
  .object({
    email: z.string().trim().email("Please enter a valid email."),
    confirmEmail: z
      .string()
      .trim()
      .email("Please enter a valid confirmation email."),
    password: z.string().min(1, "Password is required."),
    confirmPassword: z.string().min(1, "Please confirm your password."),
  })
  .merge(usernameSchema) // Combine with the username object schema
  .superRefine((value, ctx) => {
    if (value.email !== value.confirmEmail) {
      ctx.addIssue({
        code: "custom",
        path: ["confirmEmail"],
        message: "Emails do not match.",
      });
    }

    if (value.password !== value.confirmPassword) {
      ctx.addIssue({
        code: "custom",
        path: ["confirmPassword"],
        message: "Passwords do not match.",
      });
    }
  });
