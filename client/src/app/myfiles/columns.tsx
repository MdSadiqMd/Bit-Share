"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";

type File = {
  fileName: string;
  fileurl: string;
  fileType: string | null;
  receiveremail: string;
  senderEmail: string;
  sharedAt: string;
  updatedAt: string;
  createdAt: string;
  _id: string;
};

export const columns: ColumnDef<File>[] = [
  {
    accessorKey: "fileName",
    /*header: () => <div className="text-left">File Name</div>,
    cell: ({ row }) => {
      const sortedNames = row.getValue("fileName").split(" ").sort().join(" ");
      return <div className="text-left font-medium">{sortedNames}</div>;
    },*/
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          File Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "senderEmail",
    /*header: () => <div className="text-left">Sender Email</div>,
    cell: ({ row }) => {
      const sortedEmail = row
        .getValue("senderEmail")
        .toLowerCase()
        .split("@")
        .sort()
        .join("@");
      return <div className="text-left font-medium">{sortedEmail}</div>;
    */
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Sender Email
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "fileType",
    header: "File Type",
  },
  {
    accessorKey: "sharedAt",
    /*
    header: () => <div className="text-left">Shared At</div>,
    cell: ({ row }) => {
      const formatted = new Date(row.getValue("sharedAt")).toLocaleDateString();
      return <div className="text-left font-medium">{formatted}</div>;
    },
    */
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Shared At
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "fileURL",
    header: "file URL",
  },
];
