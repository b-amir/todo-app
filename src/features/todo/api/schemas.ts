import { z } from "zod";

export const TodoSchema = z.object({
  id: z.number(),
  todo: z.string(),
  completed: z.boolean(),
  userId: z.number(),
});

export const TodosResponseSchema = z.object({
  todos: z.array(TodoSchema),
  total: z.number(),
  skip: z.number(),
  limit: z.number(),
});

export const DeletedTodoSchema = TodoSchema.extend({
  isDeleted: z.boolean(),
  deletedOn: z.string(),
});

export type TodoOutput = z.infer<typeof TodoSchema>;
export type TodosResponseOutput = z.infer<typeof TodosResponseSchema>;
export type DeletedTodoOutput = z.infer<typeof DeletedTodoSchema>;
