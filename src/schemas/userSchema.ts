import { z } from "zod";

export const userSchema = z.object({
    name: z.string({
        required_error: "name is required",
    }).min(3, "at least three characters"),
    email: z.string({
        required_error: "Email is required",
    }).email("Email is not valid"),
    password: z.string({
        required_error: "Password is required",
    }).min(3, "at least three characters")

})