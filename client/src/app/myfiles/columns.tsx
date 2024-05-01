"use client";

import { ColumnDef } from "@tanstack/react-table";

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
    header: "file name",
  },
  {
    accessorKey: "senderEmail",
    header: "Sender Email",
  },
  {
    accessorKey: "extension",
    header: "extension",
  },
  {
    accessorKey: "sharedAt",
    header: "shared At",
  },
  {
    accessorKey: "fileURL",
    header: "preview",
  },
];
