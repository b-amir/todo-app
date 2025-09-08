import {
  useDispatch,
  useSelector,
  type TypedUseSelectorHook,
} from "react-redux";
import type { RootState, AppDispatch } from "@/src/app/store";

export * from "./useTodoMutations";
export * from "./useTodoDrag";
export * from "./useTodos";
export * from "./useTodosData";
export * from "./useTodoActions";

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
