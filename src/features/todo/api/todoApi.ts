import apiClient from "@/src/shared/utils/apiClient";
import type {
  CreateTodoRequest,
  DeletedTodo,
  Todo,
  TodosResponse,
  UpdateTodoRequest,
} from "./types";

export const fetchTodos = ({
  limit = 20,
  skip = 0,
}: { limit?: number; skip?: number } = {}): Promise<TodosResponse> => {
  return apiClient(`todos?limit=${limit}&skip=${skip}`);
};

export const createTodo = (newTodo: CreateTodoRequest): Promise<Todo> => {
  return apiClient("todos/add", {
    method: "POST",
    body: JSON.stringify(newTodo),
  });
};

export const updateTodo = ({
  id,
  ...patch
}: UpdateTodoRequest): Promise<Todo> => {
  return apiClient(`todos/${id}`, {
    method: "PUT",
    body: JSON.stringify(patch),
  });
};

export const deleteTodo = (id: string): Promise<DeletedTodo> => {
  return apiClient(`todos/${id}`, {
    method: "DELETE",
  });
};
