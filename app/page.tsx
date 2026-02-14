import Image from "next/image";
import TaskManager from "./components/TaskManager";

export default function Home() {
  return (
    
      <main className=" min-h-screen flex   items-center justify-center  bg-muted/40 p-6">
       <TaskManager />

      </main>
    
  );
}
