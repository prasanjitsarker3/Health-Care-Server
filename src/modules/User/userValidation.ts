import { Genedr } from "@prisma/client";
import { z } from "zod";

const createAdmin = z.object({
  password: z.string({ required_error: "Password required" }),
  admin: z.object({
    name: z.string({
      required_error: "Name is required",
    }),
    email: z.string({
      required_error: "Email is required",
    }),
    contactNumber: z.string({
      required_error: "Contact Number is required",
    }),
  }),
});

const createDoctor = z.object({
  password: z.string({ required_error: "Password required" }),
  doctor: z.object({
    name: z.string({
      required_error: "Name is required",
    }),
    email: z.string({
      required_error: "Email is required",
    }),
    contactNumber: z.string({
      required_error: "Contact Number is required",
    }),
    address: z.string().optional(),
    registrationNumber: z.string({
      required_error: "Registration Number Required",
    }),
    experience: z.number().optional(),
    gender: z.enum([Genedr.MALE, Genedr.FEMALE]),
    appointmentFree: z.number({ required_error: "Appointment free required" }),
    qualification: z.string({ required_error: "Qualification required" }),
    currentWorkingPlace: z.string({
      required_error: "Current working place required",
    }),
    designaton: z.string({ required_error: "Designation is required" }),
    averageRating: z.number().optional(),
  }),
});

const createPatient = z.object({
  password: z.string({ required_error: "Password required" }),
  patient: z.object({
    name: z.string({
      required_error: "Name is required",
    }),
    email: z.string({
      required_error: "Email is required",
    }),
    contactNumber: z.string({
      required_error: "Contact Number is required",
    }),
    address: z.string().optional(),
  }),
});

export const userValidation = {
  createAdmin,
  createDoctor,
  createPatient,
};
