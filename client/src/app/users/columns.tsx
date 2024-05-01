"use client";

import { ColumnDef } from "@tanstack/react-table";

type File = {
  filename: string;
  fileurl: string;
  fileType: string | null;
  receiveremail: string;
  senderemail: string;
  sharedAt: string;
  updatedAt: string;
  createdAt: string;
  _id: string;
};

export const columns: ColumnDef<File>[] = [
  {
    accessorKey: "filename",
    header: "File Name",
  },
  {
    accessorKey: "senderemail",
    header: "Sender",
  },
  {
    accessorKey: "fileType",
    header: "fileType",
  },
  {
    accessorKey: "sharedAt",
    header: "sharedAt",
  },
  {
    accessorKey: "fileurl",
    header: "fileurl",
  },
];
