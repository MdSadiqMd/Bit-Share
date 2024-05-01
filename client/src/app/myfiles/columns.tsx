"use client";

import { ColumnDef } from "@tanstack/react-table";
import React from "react";

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
    header: () => <div className="text-left">File Name</div>,
    cell: ({ row }) => {
      const sortedNames = row.getValue("fileName").split(" ").sort().join(" ");
      return <div className="text-left font-medium">{sortedNames}</div>;
    },
  },
  {
    accessorKey: "senderEmail",
    header: () => <div className="text-left">Sender Email</div>,
    cell: ({ row }) => {
      const sortedEmail = row
        .getValue("senderEmail")
        .toLowerCase()
        .split("@")
        .sort()
        .join("@");
      return <div className="text-left font-medium">{sortedEmail}</div>;
    },
  },
  {
    accessorKey: "fileType",
    header: "File Type",
  },
  {
    accessorKey: "sharedAt",
    header: () => <div className="text-left">Shared At</div>,
    cell: ({ row }) => {
      const formatted = new Date(row.getValue("sharedAt")).toLocaleDateString();
      return <div className="text-left font-medium">{formatted}</div>;
    },
  },
  {
    accessorKey: "fileURL",
    header: "file URL",
  },
];
