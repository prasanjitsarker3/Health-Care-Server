import z, { string } from "zod";

const updateAdminSchema = z.object({
  body: z.object({
    name: z.string().optional(),
    contractNumber: string().optional(),
  }),
});

export const adminValidationSchema = {
  updateAdminSchema,
};
