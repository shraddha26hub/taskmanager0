"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Check, X } from "lucide-react";
import { Task } from "@/types/task";

type Props = {
  task: Task;
  toggleComplete: (id: number) => void;
  deleteTask: (id: number) => void;
  startPauseTimer: (id: number) => void;
  stopTimer: (id: number) => void;
  timerStarted:(id:number)=> void;
};

export default function TaskItem({
  task,
  toggleComplete,
  deleteTask,
  startPauseTimer,
  stopTimer,
  timerStarted
}: Props) {
  const minutes = Math.floor((task.timeLeft ?? 0) / 60)
    .toString()
    .padStart(2, "0");

  const seconds = ((task.timeLeft ?? 0) % 60)
    .toString()
    .padStart(2, "0");

  return (
    <Card className="p-6 flex flex-col gap-5 rounded-2xl shadow-sm transition hover:shadow-md">
      <div className="flex justify-between items-start">
        <h2
          className={`text-lg font-semibold leading-snug ${
            task.completed ? "line-through text-muted-foreground" : ""
          }`}
        >
          {task.title}
        </h2>

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

      <div className="flex flex-col gap-4">
        <div className="flex justify-center">
          <span className="text-4xl font-mono font-bold text-primary tracking-widest">
            {minutes}:{seconds}
          </span>
        </div>

        <div className="flex justify-center gap-3 flex-wrap">
          {!task.timerStarted && (
            <Button
              className="min-w-[120px]"
              onClick={() => startPauseTimer(task.id)}
            >
              Start Timer
            </Button>
          )}

          {task.timerStarted && (
            <>
              <Button
                variant="secondary"
                className="min-w-[120px]"
                onClick={() => startPauseTimer(task.id)}
              >
                {task.timerRunning ? "Pause Timer" : "Resume Timer"}
              </Button>

              <Button
                variant="destructive"
                className="min-w-[120px]"
                onClick={() => stopTimer(task.id)}
              >
                Stop Timer
              </Button>
            </>
          )}
        </div>
      </div>
    </Card>
  );
}