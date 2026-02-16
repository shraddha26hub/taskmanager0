"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import FilterTabs from "./FilterTabs";
import TaskItem from "./TaskItem";
import TaskCompleteToast from "./TaskCompleteToast"; 
import { Task } from "@/types/task";
import { useRouter } from "next/navigation";

export default function TaskManager() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [archivedTasks, setArchivedTasks] = useState<Task[]>([]);
  const [input, setInput] = useState("");
  const [filter, setFilter] = useState<"all" | "pending" | "completed">("all");
  const [showCongrats, setShowCongrats] = useState(false);

  const router = useRouter();

  useEffect(() => {
    const stored = localStorage.getItem("archivedTasks");
    if (stored) setArchivedTasks(JSON.parse(stored));
  }, []);

  useEffect(() => {
    localStorage.setItem("archivedTasks", JSON.stringify(archivedTasks));
  }, [archivedTasks]);

  useEffect(() => {
    const interval = setInterval(() => {
      setTasks((prev) =>
        prev.map((t) =>
          t.timerRunning && t.timeLeft && t.timeLeft > 0
            ? { ...t, timeLeft: t.timeLeft - 1 }
            : t
        )
      );
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const addTask = () => {
    if (!input.trim()) return;
    const newTask: Task = {
      id: Date.now(),
      title: input,
      completed: false,
      timerRunning: false,
      timeLeft: 25 * 60,
    };
    setTasks((prev) => [...prev, newTask]);
    setInput("");
  };

  const toggleComplete = (id: number) => {
    let completedTask: Task | null = null;

    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === id) {
          const updatedTask = { ...t, completed: !t.completed, completedAt: !t.completed ? new Date() : t.completedAt };
          if (!t.completed) completedTask = updatedTask;
          return updatedTask;
        }
        return t;
      })
    );

    if (completedTask) {
      setShowCongrats(true);

      setArchivedTasks((prev) => {
        const exists = prev.find((t) => t.id === completedTask!.id);
        if (!exists) return [...prev, completedTask!];
        return prev;
      });
    }
  };

  const deleteTask = (id: number) =>
    setTasks((prev) => prev.filter((t) => t.id !== id));

  const startPauseTimer = (id: number) =>
    setTasks((prev) =>
      prev.map((t) =>
        t.id === id ? { ...t, timerRunning: !t.timerRunning } : t
      )
    );

  const stopTimer = (id: number) =>
    setTasks((prev) =>
      prev.map((t) =>
        t.id === id ? { ...t, timerRunning: false, timeLeft: 25 * 60 } : t
      )
    );

  const filteredTasks = tasks.filter((t) => {
    if (filter === "pending") return !t.completed;
    if (filter === "completed") return t.completed;
    return true;
  });

  return (
    <>
      <Card className="w-full max-w-md p-6 space-y-4">
        <h1 className="text-2xl font-bold text-center">Focused Task Manager</h1>

        <div className="flex gap-2">
          <Input
            placeholder="Add new task"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addTask()}
          />
          <Button onClick={addTask}>Add</Button>
        </div>

        <FilterTabs value={filter} onChange={setFilter} />
        {tasks.length === 0 && (
          <p className="text-center text-muted-foreground">
            No tasks yet. Add one to get started 🚀
          </p>
        )}

        <div className="space-y-4">
          {filteredTasks.map((task) => (
            <TaskItem
              key={task.id}
              task={task}
              toggleComplete={toggleComplete}
              deleteTask={deleteTask}
              startPauseTimer={startPauseTimer}
              stopTimer={stopTimer}
            />
          ))}
        </div>
        <Button
          variant="outline"
          onClick={() => router.push("/archive")}
        >
          View Archive
        </Button>
      </Card>

      <TaskCompleteToast
        show={showCongrats}
        onClose={() => setShowCongrats(false)}
      />
    </>
  );
}
