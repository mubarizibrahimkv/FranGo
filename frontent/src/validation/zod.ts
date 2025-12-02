import { z } from "zod";

export const addressSchema = z.object({
    fullName: z
        .string()
        .nonempty("Full Name is required")
        .min(3, "Full Name must be at least 3 characters"),
    phoneNumber: z
        .string()
        .regex(/^[0-9]{10,15}$/, "Enter a valid phone number"),
    address: z.string().min(5, "Address is required"),
    city: z.string().min(2, "City is required"),
    state: z.string().min(2, "State is required"),
    pinCode: z.string().regex(/^[0-9]{5,6}$/, "Enter a valid pin code"),
    country: z.string().min(2, "Country is required"),
    isDefault: z.boolean().optional(),
});

export type AddressFormData = z.infer<typeof addressSchema>;
