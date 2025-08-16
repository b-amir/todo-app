import { describe, it, expect, vi, beforeEach } from "vitest";
import { fetchTodos, createTodo, updateTodo, deleteTodo } from "./todoApi";
import type { CreateTodoRequest, UpdateTodoRequest } from "./types";
import "@testing-library/jest-dom";
import apiClient from "@/src/shared/utils/apiClient";

// Mock the apiClient
vi.mock("./apiClient", () => ({
  default: vi.fn(),
}));

const mockApiClient = vi.mocked(apiClient);

describe("todoApi", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("fetchTodos", () => {
    it("calls apiClient with correct parameters and default values", async () => {
      const mockResponse = {
        todos: [{ id: 1, todo: "Test todo", completed: false, userId: 1 }],
        total: 1,
        skip: 0,
        limit: 20,
      };

      mockApiClient.mockResolvedValue(mockResponse);

      const result = await fetchTodos();

      expect(mockApiClient).toHaveBeenCalledWith("todos?limit=20&skip=0");
      expect(result).toEqual(mockResponse);
    });

    it("calls apiClient with custom parameters", async () => {
      const mockResponse = {
        todos: [],
        total: 0,
        skip: 10,
        limit: 5,
      };

      mockApiClient.mockResolvedValue(mockResponse);

      const result = await fetchTodos({ limit: 5, skip: 10 });

      expect(mockApiClient).toHaveBeenCalledWith("todos?limit=5&skip=10");
      expect(result).toEqual(mockResponse);
    });

    it("handles API errors", async () => {
      const error = new Error("Network error");
      mockApiClient.mockRejectedValue(error);

      await expect(fetchTodos()).rejects.toThrow("Network error");
    });
  });

  describe("createTodo", () => {
    it("calls apiClient with correct parameters for creating a todo", async () => {
      const newTodo: CreateTodoRequest = {
        todo: "New test todo",
        completed: false,
        userId: 1,
      };

      const mockResponse = {
        id: 151,
        todo: "New test todo",
        completed: false,
        userId: 1,
      };

      mockApiClient.mockResolvedValue(mockResponse);

      const result = await createTodo(newTodo);

      expect(mockApiClient).toHaveBeenCalledWith("todos/add", {
        method: "POST",
        body: JSON.stringify(newTodo),
      });
      expect(result).toEqual(mockResponse);
    });

    it("handles API errors when creating a todo", async () => {
      const newTodo: CreateTodoRequest = {
        todo: "New test todo",
        completed: false,
        userId: 1,
      };

      const error = new Error("Creation failed");
      mockApiClient.mockRejectedValue(error);

      await expect(createTodo(newTodo)).rejects.toThrow("Creation failed");
    });
  });

  describe("updateTodo", () => {
    it("calls apiClient with correct parameters for updating a todo", async () => {
      const updateData: UpdateTodoRequest = {
        id: 1,
        todo: "Updated todo text",
        completed: true,
      };

      const mockResponse = {
        id: 1,
        todo: "Updated todo text",
        completed: true,
        userId: 1,
      };

      mockApiClient.mockResolvedValue(mockResponse);

      const result = await updateTodo(updateData);

      expect(mockApiClient).toHaveBeenCalledWith("todos/1", {
        method: "PUT",
        body: JSON.stringify({
          todo: "Updated todo text",
          completed: true,
        }),
      });
      expect(result).toEqual(mockResponse);
    });

    it("calls apiClient with partial update data", async () => {
      const updateData: UpdateTodoRequest = {
        id: 1,
        completed: true,
      };

      const mockResponse = {
        id: 1,
        todo: "Original todo text",
        completed: true,
        userId: 1,
      };

      mockApiClient.mockResolvedValue(mockResponse);

      const result = await updateTodo(updateData);

      expect(mockApiClient).toHaveBeenCalledWith("todos/1", {
        method: "PUT",
        body: JSON.stringify({
          completed: true,
        }),
      });
      expect(result).toEqual(mockResponse);
    });

    it("handles API errors when updating a todo", async () => {
      const updateData: UpdateTodoRequest = {
        id: 1,
        completed: true,
      };

      const error = new Error("Update failed");
      mockApiClient.mockRejectedValue(error);

      await expect(updateTodo(updateData)).rejects.toThrow("Update failed");
    });
  });

  describe("deleteTodo", () => {
    it("calls apiClient with correct parameters for deleting a todo", async () => {
      const todoId = 1;

      const mockResponse = {
        id: 1,
        todo: "Deleted todo",
        completed: false,
        userId: 1,
        isDeleted: true,
        deletedOn: "2024-01-15T10:30:00.000Z",
      };

      mockApiClient.mockResolvedValue(mockResponse);

      const result = await deleteTodo(todoId);

      expect(mockApiClient).toHaveBeenCalledWith("todos/1", {
        method: "DELETE",
      });
      expect(result).toEqual(mockResponse);
    });

    it("handles API errors when deleting a todo", async () => {
      const todoId = 1;

      const error = new Error("Delete failed");
      mockApiClient.mockRejectedValue(error);

      await expect(deleteTodo(todoId)).rejects.toThrow("Delete failed");
    });
  });

  describe("API integration scenarios", () => {
    it("performs a complete CRUD operation flow", async () => {
      // Create
      const newTodo: CreateTodoRequest = {
        todo: "Test CRUD todo",
        completed: false,
        userId: 1,
      };

      const createdTodo = {
        id: 151,
        todo: "Test CRUD todo",
        completed: false,
        userId: 1,
      };

      // createTodo
      mockApiClient.mockResolvedValueOnce(createdTodo);
      // updateTodo
      mockApiClient.mockResolvedValueOnce({ ...createdTodo, completed: true });
      // deleteTodo
      mockApiClient.mockResolvedValueOnce({
        ...createdTodo,
        completed: true,
        isDeleted: true,
        deletedOn: "2024-01-15T10:30:00.000Z",
      });

      // Create todo
      const createResult = await createTodo(newTodo);
      expect(createResult).toEqual(createdTodo);

      // Update todo
      const updateResult = await updateTodo({ id: 151, completed: true });
      expect(updateResult.completed).toBe(true);

      // Delete todo
      const deleteResult = await deleteTodo(151);
      expect(deleteResult.isDeleted).toBe(true);
    });

    it("handles network failures gracefully", async () => {
      const networkError = new Error("Network request failed");
      mockApiClient.mockRejectedValue(networkError);

      // Test all functions handle network errors
      await expect(fetchTodos()).rejects.toThrow("Network request failed");
      await expect(
        createTodo({ todo: "test", completed: false, userId: 1 })
      ).rejects.toThrow("Network request failed");
      await expect(updateTodo({ id: 1, completed: true })).rejects.toThrow(
        "Network request failed"
      );
      await expect(deleteTodo(1)).rejects.toThrow("Network request failed");
    });
  });
});
