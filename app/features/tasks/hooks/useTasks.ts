"use client";

import { useStore } from "../../../lib/store";
import { Task } from "../../../lib/types";

export function useTasks() {
  const tasks = useStore((state) => state.tasks);
  const addTaskAction = useStore((state) => state.addTask);
  const completeTaskAction = useStore((state) => state.completeTask);
  const deleteTaskAction = useStore((state) => state.deleteTask);

  const addTask = (title: string, xp: number, category: string) => {
    const newTask: Task = {
      id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
      title,
      status: "todo",
      priority: "medium",
      category,
      xpReward: xp,
      tags: [],
      createdAt: new Date().toISOString(),
      completedAt: null,
    };
    addTaskAction(newTask);
  };

  const completeTask = (id: string) => {
    return completeTaskAction(id);
  };

  const deleteTask = (id: string) => {
    deleteTaskAction(id);
  };

  return {
    tasks,
    addTask,
    completeTask,
    deleteTask,
  };
}
