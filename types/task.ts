export type Task = {
  id: number;
  title: string;
  completed: boolean;
  completedAt?: Date;
  timerRunning?: boolean;
  timeLeft?: number;
  dueDate?:Date,
};
