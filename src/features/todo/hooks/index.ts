import {
  useDispatch,
  useSelector,
  type TypedUseSelectorHook,
} from "react-redux";
import type { RootState, AppDispatch } from "@/src/app/store";

export * from "./useAddTodo";
export * from "./useDeleteTodo";
export * from "./useEditTodo";
export * from "./useTodoDrag";
export * from "./useTodos";
export * from "./useTodosActions";
export * from "./useTodosQuery";
export * from "./useTodosState";
export * from "./useTodosSync";
export * from "./useToggleTodoCompletion";

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
