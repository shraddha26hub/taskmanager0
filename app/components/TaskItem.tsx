import { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Check, X } from "lucide-react";



type Props ={
    task:{
        text: ReactNode;
        id: number;
        title: string;
        completed: boolean;
    }
    deleteTask: (id: number) => void;
    toggleTaskCompletion: (id: number) => void;
    startTimer: (id: number) => void;
    isActive: boolean;
    timeLeft: number;
    formatTime: (seconds: number) => string;
}
export default function TaskItem({
     task,
      deleteTask,
       toggleTaskCompletion, 
       startTimer, 
       isActive,
        timeLeft, 
        formatTime,
     }: Props) {
    return (
        <Card className="p-4 flex flex-col gap-2">
            <div className="flex justify-between items-center">
                <span
                className={`${
                    task.completed ? "line-through text-muted-foreground" : ""
                }`}
                >
                    {task.text}

                </span>
                <div className="flex gap-2">
                    <Button size="icon"
                        onClick={() => toggleTaskCompletion(task.id)}>
                            <Check className="h-4 w-4"/> </Button>
                    <Button size="icon"
                        onClick={() => deleteTask(task.id)}
                        variant="destructive">
                            <X className="h-4 w-4"/>

                        </Button>

                    </div>
            </div>
            <div>
                <Button size="sm" onClick={() => startTimer(task.id)}>
                    Start Timer
                </Button>
                {isActive && <span className="font-mono text-sm">{formatTime(timeLeft)}</span>}
            </div>
        </Card>
    )
}