import { z } from "zod"
const requiredString = z.string().trim().min(1, "Field is required")

export const signUpSchema = z
    .object({
        first_name: requiredString,
        last_name: requiredString,
        email: requiredString.email("Invalid email address"),
        // username: requiredString.regex(
        //     /^[a-zA-Z0-9_-]{3,30}$/,
        //     "Only letters, numbers, underscores, and hyphens are allowed",
        // ),
        password: requiredString.min(
            8,
            "Password must be at least 8 characters",
        ),
        confirmPassword: requiredString.min(
            8,
            "Password must be at least 8 characters",
        ),
    })
    .superRefine(({ confirmPassword, password }, ctx) => {
        if (confirmPassword !== password) {
            ctx.addIssue({
                code: "custom",
                message: "The passwords did not match",
                path: ["confirmPassword"],
            })
        }
    })

export type SignUpValues = z.infer<typeof signUpSchema>

export const loginSchema = z.object({
    email: requiredString.email("Invalid email address"),
    password: requiredString.min(8, "Password must be at least 8 characters"),
})

export type LoginValues = z.infer<typeof loginSchema>
