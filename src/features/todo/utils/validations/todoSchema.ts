import { z } from "zod";

const todoTextSchema = z
  .string()
  .min(3, "Todo must be at least 3 characters long")
  .max(200, "Todo text cannot exceed 200 characters")
  .trim()
  .refine(
    (val) => val.length > 0,
    "Todo cannot be empty or just whitespace"
  )
  .refine(
    (val) => !/^\s+$/.test(val),
    "Todo cannot contain only spaces"
  )
  .refine(
    (val) => !/^[\s\u200B-\u200D\uFEFF]+$/u.test(val),
    "Todo cannot contain invisible characters"
  )
  .refine(
    (val) => !/<script|javascript:|data:|vbscript:/i.test(val),
    "Todo contains potentially unsafe content"
  );

export const addTodoSchema = z.object({
  todo: todoTextSchema,
  completed: z.boolean().default(false).optional(),
});

export const editTodoSchema = z.object({
  todo: todoTextSchema,
  completed: z.boolean().optional().optional(),
});

export type AddTodoInput = z.infer<typeof addTodoSchema>;
export type EditTodoInput = z.infer<typeof editTodoSchema>;



