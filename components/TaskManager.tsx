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

const DEFAULT_TIME = 25 * 60;
export default function TaskManager() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [archivedTasks, setArchivedTasks] = useState<Task[]>([]);
  const [input, setInput] = useState("");
  const [filter, setFilter] =
    useState<"all" | "pending" | "completed">("all");
  const [showCongrats, setShowCongrats] = useState(false);

  const router = useRouter();

  useEffect(() => {
    const storedTasks = localStorage.getItem("tasks");
    const storedArchive = localStorage.getItem("archivedTasks");

    if (storedTasks) setTasks(JSON.parse(storedTasks));
    if (storedArchive) {
      const parsed: Task[] = JSON.parse(storedArchive).map((t: any) => ({
        ...t,
        completedAt: t.completedAt ? new Date(t.completedAt) : undefined,
      }));
      setArchivedTasks(parsed);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem("archivedTasks", JSON.stringify(archivedTasks));
  }, [archivedTasks]);

  useEffect(() => {
    const interval = setInterval(() => {
      setTasks((prev) =>
        prev.map((t) => {
          if (t.timerRunning && t.timeLeft > 0) {
            return { ...t, timeLeft: t.timeLeft - 1 };
          }
          if (t.timerRunning && t.timeLeft === 0) {
            return { ...t, timerRunning: false };
          }
          return t;
        })
      );
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const addTask = () => {
    if (!input.trim()) return;

    const newTask: Task = {
      id: Date.now(),
      title: input.trim(),
      completed: false,
      timerRunning: false,
      timerStarted: false,
      timeLeft: DEFAULT_TIME,
    };

    setTasks((prev) => [...prev, newTask]);
    setInput("");
  };

  const toggleComplete = (id: number) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === id && !t.completed) {
          const updated = {
            ...t,
            completed: true,
            completedAt: new Date(),
          };

          setArchivedTasks((prevArchive) => {
            const exists = prevArchive.find((a) => a.id === updated.id);
            if (!exists) return [...prevArchive, updated];
            return prevArchive;
          });

          setShowCongrats(true);
          return updated;
        }
        return t;
      })
    );
  };

  const deleteTask = (id: number) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  const startPauseTimer = (id: number) => {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === id
          ? { ...t, timerStarted: true, timerRunning: !t.timerRunning }
          : t
      )
    );
  };

  const stopTimer = (id: number) => {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === id
          ? { ...t, timerRunning: false, timerStarted: false, timeLeft: DEFAULT_TIME }
          : t
      )
    );
  };

  const filteredTasks = tasks.filter((t) => {
    if (filter === "pending") return !t.completed;
    if (filter === "completed") return t.completed;
    return true;
  });

  return (
    <>
      <Card className="w-full max-w-md mx-auto p-6 space-y-6 rounded-2xl shadow-md">
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
              stopTimer={stopTimer} timerStarted={function (id: number): void {
                throw new Error("Function not implemented.");
              } }            />
          ))}
        </div>

        <Button
          variant="outline"
          className="w-full"
          onClick={() =>
            router.push("/archive") 
          }
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