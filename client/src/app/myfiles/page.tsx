"use client";

import Navbar from "@/components/ui/navbar";
import { Table } from "@/components/ui/table";
import React, { useEffect, useMemo, useState } from 'react'
import io from 'socket.io-client'
import { AppDispatch, useAppSelector } from '@/redux/store';
import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { logIn, logOut } from '@/redux/features/auth-slice';
import { toast } from 'react-toastify';

interface File {
  createdAt: string;
  filename: string;
  fileurl: string;
  fileType: string | null;
  receiveremail: string;
  senderemail: string;
  sharedAt: string;
  updatedAt: string;
  _id: string;
}

let socket: any = null;
let apiurl: string = `${process.env.NEXT_PUBLIC_URL}`

const myFilesPage = () => {
  return (
    <>
      <div>
        <Navbar />
      </div>
      <Table />
    </>
  );
};

export default myFilesPage;
