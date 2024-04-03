import z from "zod";

export const specialtiesValidationSchema = z.object({
  title: z.string({ required_error: "Title is required !" }),
});
