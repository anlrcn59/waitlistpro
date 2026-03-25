import { z } from "zod";

export const createWaitlistSchema = z.object({
  name: z.string().min(2, "Min 2 characters").max(100),
  slug: z
    .string()
    .min(3, "Min 3 characters")
    .max(50)
    .regex(/^[a-z0-9-]+$/, "Only lowercase letters, numbers, and hyphens"),
  description: z.string().max(500).optional(),
});

export const updateWaitlistSchema = createWaitlistSchema.partial();

export const signupSchema = z.object({
  email: z.string().email("Invalid email address"),
  referral_code: z.string().optional(),
});

export const publicSignupSchema = z.object({
  waitlist_id: z.string().uuid("Invalid waitlist ID"),
  email: z.string().email("Invalid email address"),
  referral_code: z.string().optional(),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6, "Min 6 characters"),
});

export const registerSchema = z.object({
  full_name: z.string().min(2, "Min 2 characters").max(100),
  email: z.string().email(),
  password: z.string().min(8, "Min 8 characters"),
});

export type CreateWaitlistInput = z.infer<typeof createWaitlistSchema>;
export type UpdateWaitlistInput = z.infer<typeof updateWaitlistSchema>;
export type SignupInput = z.infer<typeof signupSchema>;
// Note: subscribers table has no name column — email only
export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
