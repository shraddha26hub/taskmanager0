"use client";

import { Button } from "@/components/ui/button";

type Props = {
  isRunning: boolean;
  onStartPause: () => void;
  onStop?: () => void;
};

export default function TimerButton({ isRunning, onStartPause, onStop }: Props) {
  return (
    <div className="flex gap-2">
      <Button
        size="sm"
        variant={isRunning ? "destructive" : "outline"}
        onClick={onStartPause}
      >
        {isRunning ? "Pause Timer" : "Start Timer"}
      </Button>

      {isRunning && onStop && (
        <Button size="sm" variant="destructive" onClick={onStop}>
          Stop Timer
        </Button>
      )}
    </div>
  );
}
