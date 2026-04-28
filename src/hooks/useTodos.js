import { useState, useCallback, useEffect, useRef } from 'react';
import { todoApi } from '../api/todoApi.js';

const DEBOUNCE_MS = 300;

export function useTodos(filter) {
  const [todos, setTodos] = useState([]);
  const [stats, setStats] = useState({ total: 0, done: 0, private: 0, urgent: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const abortRef = useRef(null);

  const loadTodos = useCallback(async () => {
    if (abortRef.current) abortRef.current.abort();
    abortRef.current = new AbortController();

    setIsLoading(true);
    setError(null);

    try {
      const data = await todoApi.getAll({ filter });
      setTodos(data.items);
      setStats(data.stats);
    } catch (err) {
      if (err.name !== 'AbortError') {
        setError(err.message);
      }
    } finally {
      setIsLoading(false);
    }
  }, [filter]);

  useEffect(() => {
    loadTodos();
  }, [loadTodos]);

  const createTodo = useCallback(async (input) => {
    const data = await todoApi.create(input);
    setTodos((prev) => [data.todo, ...prev]);
    setStats((s) => ({
      ...s,
      total: s.total + 1,
      private: input.is_private ? s.private + 1 : s.private,
      urgent: input.priority === 'high' ? s.urgent + 1 : s.urgent,
    }));
    return data.todo;
  }, []);

  const unlockTodo = async (id, password) => {
    const data = await todoApi.unlock(id, password);
    setTodos((prev) =>
      prev.map((t) => (t.id === id ? { ...t, ...data.todo } : t))
    );
    return data.todo;
  };

  const toggleDone = useCallback(async (id) => {
    setTodos((prev) =>
      prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t))
    );
    setStats((s) => {
      const todo = todos.find((t) => t.id === id);
      const delta = todo?.done ? -1 : 1;
      return { ...s, done: s.done + delta };
    });

    try {
      await todoApi.toggleDone(id);
    } catch (err) {
      setTodos((prev) =>
        prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t))
      );
      throw err;
    }
  }, [todos]);

  const deleteTodo = useCallback(async (id) => {
    const todo = todos.find((t) => t.id === id);
    setTodos((prev) => prev.filter((t) => t.id !== id));
    setStats((s) => ({
      ...s,
      total: s.total - 1,
      done: todo?.done ? s.done - 1 : s.done,
      private: todo?.is_private ? s.private - 1 : s.private,
    }));

    try {
      await todoApi.delete(id);
    } catch (err) {
      setTodos((prev) => [todo, ...prev]);
      throw err;
    }
  }, [todos]);

  return {
    todos,
    stats,
    isLoading,
    error,
    loadTodos,
    createTodo,
    unlockTodo,
    toggleDone,
    deleteTodo,
  };
}
