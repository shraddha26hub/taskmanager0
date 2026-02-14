"use client"
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import TaskItem from "./TaskItem";


type Task={
    id: number;
    title: string;
    text: string;
    completed: boolean;
}


export default function TaskManager() {
    const [tasks, setTasks] = useState<Task[]>([])
    const [input, setInput] = useState("")
    const [filter, setFilter] = useState<"all"| "pending" |"completed">("all")


    const[activeTaskId, setActiveTaskId] = useState<number | null>(null)
    const [timeLeft, setTimeLeft] = useState(0)

    useEffect(()=>{
        if(timeLeft <= 0 ) return

        const interval = setInterval(()=>{
            setTimeLeft((prev)=> prev - 1)
        }, 1000)

        return () => clearInterval(interval)
    }, [timeLeft])

    const addTask = () => {
        if(!input.trim()) return

        const newTask: Task = {
            id: Date.now(),
            title: input,
            text: input,
            completed: false
        }
        setTasks((prev) => [...prev, newTask])
        setInput("")
    }
    const deleteTask = (id: number) => {
        setTasks((prev) => prev.filter((task) => task.id !== id))
    }

    const toggleTaskCompletion = (id: number) => {
        setTasks((prev) =>
            prev.map((task) =>
                task.id === id ? { ...task, completed: !task.completed } : task
            )
        )
    }
    const startTimer = (id: number) => {
        setActiveTaskId(id)
        setTimeLeft(25 * 60) 
    }
    const filteredTasks = tasks.filter((task) => {
        if (filter === "pending") return !task.completed
        if (filter === "completed") return task.completed
        return true
    })
    const formatTime = (seconds: number) => {
        const min = Math.floor(seconds / 60)
        const secs = seconds % 60
        return `${min}:${secs.toString().padStart(2, "0")}`
    }

    return (
        <Card className="w-full max-w-md p-6 space-y-4">
            <h1 className="text-2xl font-bold text-center">Focused Time Manager</h1>
            <div className="flex gap-2">
                <Input
                placeholder="Add new task"
                value={input}
                onChange={(e)=>setInput(e.target.value)}
                 onKeyDown={(e) => {
                    if (e.key === "Enter") addTask()
                }}
                />
                <Button onClick={addTask}>Add</Button>
            
            </div>
            <div className="flex justify-between">
                <Button variant="outline" onClick={() => setFilter("all")}>
                    All
                </Button>
                <Button variant="outline" onClick={() => setFilter("pending")}>
                    Pending
                </Button>
                <Button variant="outline" onClick={() => setFilter("completed")}>
                    Completed
                </Button>
            </div>
            {tasks.length ===0 &&(
                <p className="text-center text-muted-foreground">No tasks yet. Add one to get started</p>

            )}
            <div>
                {filteredTasks.map((task) => (
                    <TaskItem
                    key={task.id}
                    task={task}
                    deleteTask={deleteTask}
                    toggleTaskCompletion={toggleTaskCompletion}
                    startTimer={startTimer}
                    isActive={activeTaskId === task.id}
                    timeLeft={activeTaskId === task.id ? timeLeft : 0}
                    formatTime={formatTime}
                    />
                ))}
                
            </div>
        </Card>
    )
}