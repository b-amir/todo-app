
export interface Todo {
  id: number;
  todo: string;
  completed: boolean;
  userId: number;
  _tempId?: number;
}

export interface TodosResponse {
  todos: Todo[];
  total: number;
  skip: number;
  limit: number;
}

export interface CreateTodoRequest {
  todo: string;
  completed: boolean;
  userId: number;
}

export interface UpdateTodoRequest {
  id: number;
  todo?: string;
  completed?: boolean;
}

export interface DeletedTodo extends Todo {
  isDeleted: boolean;
  deletedOn: string;
}