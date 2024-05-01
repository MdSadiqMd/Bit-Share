"use client";

import Navbar from "@/components/ui/navbar";
import { Table } from "@/components/ui/table";
import React, { useEffect, useMemo, useState } from "react";
import io from "socket.io-client";
import { AppDispatch, useAppSelector } from "@/redux/store";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { logIn, logOut } from "@/redux/features/auth.slice";
import { toast } from "react-toastify";
import { Payment, columns } from "./columns";
import { DataTable } from "./data-table";

interface File {
  createdAt: string;
  filename: string;
  fileURL: string;
  fileType: string | null;
  receiveremail: string;
  senderemail: string;
  sharedAt: string;
  updatedAt: string;
  _id: string;
}

let socket: any = null;
let apiurl: string = `${process.env.NEXT_PUBLIC_URL}`;

const myFilesPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const auth = useAppSelector((state) => state.authReducer);
  const [data, setData] = useState<File[]>([]);

  const getAllFiles = async () => {
    let res = await fetch(process.env.NEXT_PUBLIC_URL + "/file/getfiles", {
      method: "GET",
      credentials: "include",
    });
    let resjson = await res.json();
    if (resjson.ok) {
      console.log(resjson.data);
      setData(resjson.data);
    }
  };

  const getFileType = (fileURL: string) => {
    const extension = fileURL?.split(".").pop()?.toLowerCase();
    let fileType = "unknown";
    if (extension) {
      switch (extension) {
        case "mp4":
        case "avi":
        case "mov":
          fileType = "video";
          break;

        case "jpg":
        case "jpeg":
        case "png":
        case "gif":
          fileType = "image";
          break;

        case "pdf":
        case "doc":
        case "docx":
        case "txt":
          fileType = "document";
          break;

        default:
          fileType = "unknown";
          break;
      }
    }
    return fileType;
  };

  useEffect(() => {
    getAllFiles();
    console.log(data);
  }, []);

  // const [socketId, setSocketId] = useState<string>("")
  // socket = useMemo(() => io(apiurl), [])

  const router = useRouter();
  /*
  useEffect(() => {
    console.log(auth.isAuth)
    if (!auth.isAuth) {
      return router.push("/login");
    }
  }, [auth]);
  */

  // useEffect(() => {
  //     socket.on('connect', () => {
  //       console.log(socket.id)
  //       setSocketId(socket.id)
  //     })

  //     if(auth.user){socket.emit('joinself',auth.user.email)}
  //     else {
  //       getuserdata().then((user)=>{
  //         socket.emit('joinself',user.email)
  //       })
  //     }

  //     socket.on('notify', (data:any) => {
  //       toast.info('New file shared with you' + data.from)
  //       getAllFiles()
  //     })

  // }, [])

  const getuserdata = async () => {
    let res = await fetch(process.env.NEXT_PUBLIC_URL + "/auth/getuser", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });
    let data = await res.json();
    if (data.ok) {
      dispatch(logIn(data.data));
      return data.data;
    } else {
      dispatch(logOut());
      router.push("/login");
    }
  };

  return (
    <>
      <div>
        <Navbar />
      </div>
      <div className="container mx-auto py-10">
        <DataTable
          columns={columns}
          data={data.map((file) => ({
            ...file,
            fileType: getFileType(file.fileURL),
          }))}
        />
      </div>
    </>
  );
};

export default myFilesPage;
