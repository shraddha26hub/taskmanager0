"use client";
import { useEffect, useState } from "react";
import Confetti from "react-confetti";
import { Button } from "@/components/ui/button";

type Props = {
  show: boolean;
  onClose: () => void;
};

export default function TaskCompleteToast({ show, onClose }: Props) {
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    setWindowSize({ width: window.innerWidth, height: window.innerHeight });

    const handleResize = () =>
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (!show) return null;

  return (
    <>
      <Confetti
        width={windowSize.width}
        height={windowSize.height}
        recycle={false}
        numberOfPieces={250}
        gravity={0.3}
        colors={[
          "#ff595e",
          "#ffca3a", 
          "#8ac926", 
          "#1982c4", 
          "#6a4c93", 
          "#f28482", 
        ]}
      />

      <div className="fixed top-1/4 left-1/2 -translate-x-1/2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl shadow-xl p-6 z-50 flex flex-col items-center gap-4 animate-fade-in">
        <h2 className="text-2xl font-bold text-[var(--primary)] text-center">
          🎉 Congratulations! 🎉
        </h2>
        <p className="text-center text-gray-700 dark:text-gray-200">
          You completed a task!
        </p>
        <Button onClick={onClose} variant="outline" size="sm">
          Close
        </Button>
      </div>
    </>
  );
}
