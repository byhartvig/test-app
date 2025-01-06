"use client";

import { useState, useEffect } from "react";
import { DataTable } from "@/components/data-table";
import { Badge } from "@/components/ui/badge";
import { ArrowUpDown, MoreHorizontal, Pencil, Trash } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

// Fake data generator
function generateFakeUsers(count = 100) {
  const roles = ["admin", "user", "editor", "viewer"];
  const statuses = ["active", "inactive", "pending"];

  return Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    name: `User ${i + 1}`,
    email: `user${i + 1}@example.com`,
    role: roles[Math.floor(Math.random() * roles.length)],
    status: statuses[Math.floor(Math.random() * statuses.length)],
    createdAt: new Date(
      Date.now() - Math.floor(Math.random() * 90 * 24 * 60 * 60 * 1000)
    ).toISOString(),
  }));
}

export default function UsersPage() {
  const [data, setData] = useState([]);

  useEffect(() => {
    setData(generateFakeUsers(100));
  }, []);

  const columns = [
    {
      accessorKey: "name",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Name
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
    },
    {
      accessorKey: "email",
      header: "Email",
    },
    {
      accessorKey: "role",
      header: "Role",
      cell: ({ row }) => {
        const role = row.getValue("role");
        return (
          <Badge variant="outline" className="capitalize">
            {role}
          </Badge>
        );
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.getValue("status");
        return (
          <Badge
            variant={
              status === "active"
                ? "success"
                : status === "pending"
                ? "warning"
                : "destructive"
            }
          >
            {status}
          </Badge>
        );
      },
    },
    {
      accessorKey: "createdAt",
      header: "Created At",
      cell: ({ row }) => {
        return new Date(row.getValue("createdAt")).toLocaleDateString();
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem>
                <Pencil className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-red-600">
                <Trash className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  return (
    <div className="container mx-auto py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Users</h1>
        <p className="text-muted-foreground">
          A list of all users in your application.
        </p>
      </div>
      <DataTable
        columns={columns}
        data={data}
        searchableColumns={[
          {
            id: "name",
            title: "Name",
          },
          {
            id: "email",
            title: "Email",
          },
        ]}
        filterableColumns={[
          {
            id: "role",
            title: "Role",
            options: [
              { label: "Admin", value: "admin" },
              { label: "User", value: "user" },
              { label: "Editor", value: "editor" },
              { label: "Viewer", value: "viewer" },
            ],
          },
          {
            id: "status",
            title: "Status",
            options: [
              { label: "Active", value: "active" },
              { label: "Inactive", value: "inactive" },
              { label: "Pending", value: "pending" },
            ],
          },
        ]}
      />
    </div>
  );
}
