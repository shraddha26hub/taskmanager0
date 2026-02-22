"use client";
import { useEffect, useState } from "react";
import ArchiveTable from "@/components/ArchiveTable";
import { Task } from "@/types/task";

export default function ArchivePage() {
  const [archivedTasks, setArchivedTasks] = useState<Task[]>([]);

 useEffect(() => {
  const stored = localStorage.getItem("archivedTasks");
  if (stored) {
    const parsed: Task[] = JSON.parse(stored).map((t: any) => ({
      ...t,
      completedAt: t.completedAt ? new Date(t.completedAt) : undefined,
    }));
    setArchivedTasks(parsed);
  }
}, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Archived Tasks</h1>
      <ArchiveTable archivedTasks={archivedTasks} />
    </div>
  );
}
