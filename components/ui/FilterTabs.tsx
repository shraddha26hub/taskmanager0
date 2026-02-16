"use client";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

type Props = {
  value: "all" | "pending" | "completed";
  onChange: (v: "all" | "pending" | "completed") => void;
};

export default function FilterTabs({ value, onChange }: Props) {
  return (
    <Tabs value={value} onValueChange={(v) => onChange(v as "all" | "pending" | "completed")} className="w-full">
      <TabsList>
        <TabsTrigger value="all">All</TabsTrigger>
        <TabsTrigger value="pending">Pending</TabsTrigger>
        <TabsTrigger value="completed">Completed</TabsTrigger>
      </TabsList>
    </Tabs>
  );
}
