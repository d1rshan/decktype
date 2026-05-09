import { z } from "zod";

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
      } else if (val.length > 0 && (val.length < 3 || val.length > 30)) {
        ctx.addIssue({
          code: "custom",
          message: "Username must be between 3 and 30 characters.",
        });
      }
    }),
  password: z.string().min(1, "Password is required."),
});

export const registerSchema = z
  .object({
    username: z
      .string()
      .trim()
      .min(3, "Username must be at least 3 characters.")
      .max(30, "Username must be at most 30 characters."),
    email: z.string().trim().email("Please enter a valid email."),
    confirmEmail: z
      .string()
      .trim()
      .email("Please enter a valid confirmation email."),
    password: z.string().min(1, "Password is required."),
    confirmPassword: z.string().min(1, "Please confirm your password."),
  })
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
