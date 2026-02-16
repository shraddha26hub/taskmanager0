"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Check, X } from "lucide-react";
import { Task } from "@/types/task";

type Props = {
  task: Task;
  toggleComplete: (id: number) => void;
  deleteTask: (id: number) => void;
  startPauseTimer: (id: number) => void;
  stopTimer: (id: number) => void;
};

export default function TaskItem({
  task,
  toggleComplete,
  deleteTask,
  startPauseTimer,
  stopTimer,
}: Props) {
  const minutes = Math.floor((task.timeLeft ?? 0) / 60)
    .toString()
    .padStart(2, "0");

  const seconds = ((task.timeLeft ?? 0) % 60)
    .toString()
    .padStart(2, "0");

  return (
    <Card className="p-5 flex flex-col gap-4 shadow-sm">
      <div className="flex justify-between items-center">
        <span
          className={`text-lg font-medium ${
            task.completed
              ? "line-through text-muted-foreground"
              : ""
          }`}
        >
          {task.title}
        </span>

        <div className="flex gap-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size="icon"
                variant="ghost"
                onClick={() => toggleComplete(task.id)}
              >
                <Check className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Mark Complete</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size="icon"
                variant="ghost"
                onClick={() => deleteTask(task.id)}
              >
                <X className="h-4 w-4 text-destructive" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Delete Task</TooltipContent>
          </Tooltip>
        </div>
      </div>

      <div className="flex justify-between items-center">
        <span className="text-3xl font-mono font-bold text-primary tracking-widest">
          {minutes}:{seconds}
        </span>

        <div className="flex gap-2">
          <Button
            onClick={() => startPauseTimer(task.id)}
            variant={task.timerRunning ? "secondary" : "default"}
          >
            {task.timerRunning ? "Pause Timer" : "Start Timer"}
          </Button>

          {task.timerRunning && (
            <Button
              variant="destructive"
              onClick={() => stopTimer(task.id)}
            >
              Stop Timer
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
}
