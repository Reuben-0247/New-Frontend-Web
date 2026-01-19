import { z } from "zod";

export const boardSchema = z.object({
  name: z.string().min(1, "Title is required"),
  type: z.enum(["note", "document"]),
  content: z.any(),
});

export const boardsFormSchema = z.object({
  boards: z.array(boardSchema).min(1, "Add at least one board"),
});

export type BoardsFormInput = z.infer<typeof boardsFormSchema>;
