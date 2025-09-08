export type TempId = string & { readonly __brand: "TempId" };

export interface Todo {
  readonly id: number;
  readonly todo: string;
  readonly completed: boolean;
  readonly userId: number;
  readonly _tempId?: TempId;
}

export interface TodosResponse {
  readonly todos: readonly Todo[];
  readonly total: number;
  readonly skip: number;
  readonly limit: number;
}

export interface CreateTodoRequest {
  readonly todo: string;
  readonly completed: boolean;
  readonly userId: number;
}

export interface UpdateTodoRequest {
  readonly id: number;
  readonly todo?: string;
  readonly completed?: boolean;
}

export interface DeletedTodo extends Todo {
  readonly isDeleted: boolean;
  readonly deletedOn: string;
}
