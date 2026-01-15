import { z } from "zod";

export const entrySchema = z.object({
  fullName: z
    .string()
    .min(3, "Name must be atleast 3 Characters")
    .max(50, "Name must be less than 50 characters"),

  email: z.string().email("Invalid Email Format").toLowerCase(),

  age: z.coerce
    .number()
    .int("Age must be an Integer")
    .min(1, "Age must be atleast 1 Characters")
    .max(120, "Age must be less than 120 characters"),

  gender: z.enum(["male", "female", "other"], {
    message: "Gender must be male, female, other",
  }),
});


export const userSignupSchema = z.object({
  name: z.string()
    .min(3, 'Name must be atleast 3 Characters')
    .max(50, 'Name must be less than 50 Characters'),

  email: z.string()
    .email()
    .toLowerCase(),

  password: z.string()
    .min(6, 'Password must be atleast 6 characters')
})

export const userLoginSchema = z.object({
  email: z.string()
    .email('Invalid email format'),

  password: z.string()
    .min(1, 'Password is required')
})

export type EnterInput = z.infer<typeof entrySchema>;
export type UserSignupInput = z.infer<typeof userSignupSchema>;
export type UserLoginSchema = z.infer<typeof userLoginSchema>;