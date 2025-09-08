import apiClient, { ApiError } from "@/src/shared/utils/apiClient";
import type {
  CreateTodoRequest,
  DeletedTodo,
  Todo,
  TodosResponse,
  UpdateTodoRequest,
} from "./types";
import { DeletedTodoSchema, TodoSchema, TodosResponseSchema } from "./schemas";

export const fetchTodos = ({
  limit = 20,
  skip = 0,
}: { limit?: number; skip?: number } = {}): Promise<TodosResponse> => {
  return apiClient(`todos?limit=${limit}&skip=${skip}`).then((data) => {
    const parsed = TodosResponseSchema.safeParse(data);
    if (!parsed.success) {
      throw new ApiError("Invalid todos response", 500);
    }
    return parsed.data;
  });
};

export const createTodo = (newTodo: CreateTodoRequest): Promise<Todo> => {
  return apiClient("todos/add", {
    method: "POST",
    body: JSON.stringify(newTodo),
  }).then((data) => {
    const parsed = TodoSchema.safeParse(data);
    if (!parsed.success) {
      throw new ApiError("Invalid todo response", 500);
    }
    return parsed.data;
  });
};

export const updateTodo = ({
  id,
  ...patch
}: UpdateTodoRequest): Promise<Todo> => {
  return apiClient(`todos/${id}`, {
    method: "PUT",
    body: JSON.stringify(patch),
  }).then((data) => {
    const parsed = TodoSchema.safeParse(data);
    if (!parsed.success) {
      throw new ApiError("Invalid todo response", 500);
    }
    return parsed.data;
  });
};

export const deleteTodo = (id: number): Promise<DeletedTodo> => {
  return apiClient(`todos/${id}`, {
    method: "DELETE",
  }).then((data) => {
    const parsed = DeletedTodoSchema.safeParse(data);
    if (!parsed.success) {
      throw new ApiError("Invalid delete response", 500);
    }
    return parsed.data;
  });
};
