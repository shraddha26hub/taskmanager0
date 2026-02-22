"use client";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useState, useMemo, useEffect } from "react";
import { Task } from "@/types/task";

type Props = {
  archivedTasks: Task[]; 
};

export default function ArchiveTable({ archivedTasks }: Props) {
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState<"title" | "completedAt">("completedAt");
  const [sortAsc, setSortAsc] = useState(false);
  const [page, setPage] = useState(1);
  const pageSize = 5;

  const filteredTasks = useMemo(() => {
    let data = archivedTasks.filter((t) =>
      t.title.toLowerCase().includes(search.toLowerCase())
    );

    data.sort((a, b) => {
      if (sortKey === "title") {
        return sortAsc
          ? a.title.localeCompare(b.title)
          : b.title.localeCompare(a.title);
      } else {
        const aTime = a.completedAt ? new Date(a.completedAt).getTime() : 0;
        const bTime = b.completedAt ? new Date(b.completedAt).getTime() : 0;
        return sortAsc ? aTime - bTime : bTime - aTime;
      }
    });

    return data;
  }, [archivedTasks, search, sortKey, sortAsc]);

  const paginatedTasks = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filteredTasks.slice(start, start + pageSize);
  }, [filteredTasks, page]);

  const totalPages = Math.ceil(filteredTasks.length / pageSize);

  return (
    <Card className="w-full max-w-md mx-auto p-6 space-y-4 rounded-2xl shadow-md">
      <div className="flex flex-col sm:flex-row sm:justify-between gap-2">
        <Input
          placeholder="Search tasks..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1"
        />
        <div className="flex gap-2 flex-wrap">
          <Button
            size="sm"
            onClick={() => {
              setSortKey("title");
              setSortAsc(sortKey === "title" ? !sortAsc : true);
            }}
          >
            Sort by Title {sortKey === "title" ? (sortAsc ? "▲" : "▼") : ""}
          </Button>
          <Button
            size="sm"
            onClick={() => {
              setSortKey("completedAt");
              setSortAsc(sortKey === "completedAt" ? !sortAsc : false);
            }}
          >
            Sort by Date {sortKey === "completedAt" ? (sortAsc ? "▲" : "▼") : ""}
          </Button>
        </div>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Completed At</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {paginatedTasks.length === 0 ? (
            <TableRow>
              <TableCell colSpan={2} className="text-center text-muted-foreground">
                No tasks found
              </TableCell>
            </TableRow>
          ) : (
            paginatedTasks.map((task) => (
              <TableRow key={task.id}>
                <TableCell>{task.title}</TableCell>
                <TableCell>{task.completedAt?.toLocaleString()}</TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      <div className="flex justify-between items-center">
        <span>
          Page {page} of {totalPages || 1}
        </span>
        <div className="flex gap-2">
          <Button size="sm" onClick={() => setPage((p) => Math.max(p - 1, 1))} disabled={page === 1}>
            Prev
          </Button>
          <Button size="sm" onClick={() => setPage((p) => Math.min(p + 1, totalPages))} disabled={page === totalPages || totalPages === 0}>
            Next
          </Button>
        </div>
      </div>
    </Card>
  );
}