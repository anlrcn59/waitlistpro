import { z } from "zod";

export const createWaitlistSchema = z.object({
  name: z.string().min(2, "En az 2 karakter").max(100, "En fazla 100 karakter"),
  slug: z
    .string()
    .min(3, "En az 3 karakter")
    .max(50, "En fazla 50 karakter")
    .regex(/^[a-z0-9-]+$/, "Sadece küçük harf, rakam ve tire"),
  description: z.string().max(500, "En fazla 500 karakter").optional(),
  color: z
    .string()
    .regex(/^#[0-9a-fA-F]{6}$/, "Geçersiz renk kodu")
    .optional()
    .default("#10b981"),
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
