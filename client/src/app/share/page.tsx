"use client";

import React, { useState, useCallback, useMemo, useEffect } from "react";
import Image from "next/image";
import { useDropzone } from "react-dropzone";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { io } from "socket.io-client";
import { AppDispatch, useAppSelector } from "@/redux/store";
import { useDispatch } from "react-redux";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/ui/navbar";

let socket: any = null;
let apiurl: string = `${process.env.NEXT_PUBLIC_URL}`;

const share = () => {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const auth = useAppSelector((state) => state.authReducer);
  const [file, setFile] = useState<any>(null);
  const [email, setEmail] = useState("");
  const [fileName, setFileName] = useState("");
  const [uploading, setUploading] = useState(false);
  const [uploadpercent, setUploadpercent] = useState(0);

  let onDrop = useCallback((acceptedFiles: any) => {
    console.log(acceptedFiles);
    setFile(acceptedFiles[0]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  const handleUpload = async () => {
    console.log(email);
    console.log(file);
    console.log(fileName);
    if (!email) {
      toast.error("Please fill all the fields");
      return;
    }
    if (!file) {
      toast.error("Please select a file");
      return;
    }
    let formdata = new FormData();
    formdata.append("receiveremail", email);
    formdata.append("filename", fileName);
    if (file) {
      formdata.append("clientfile", file);
    }
    setUploading(true);
    let req = new XMLHttpRequest();
    req.open("POST", process.env.NEXT_PUBLIC_URL + "/file/sharefile", true);
    req.withCredentials = true;
    /*
    req.upload.addEventListener("progress", (event) => {
      if (event.lengthComputable) {
        const percent = (event.loaded / event.total) * 100;
        setUploadpercent(Math.round(percent));
        console.log(`Upload progress: ${Math.round(percent)}%`);
      }
    });
    req.upload.addEventListener("load", () => {
      console.log("Upload complete!");
      toast.success("File uploaded successfully");
    });
    req.upload.addEventListener("error", (error) => {
      console.error("Upload failed:", error);
      toast.error("File upload failed");
      setUploading(false);
    });
    */
    req.onreadystatechange = function () {
      if (req.readyState === 4) {
        setUploading(false);
        if (req.status === 200) {
          toast.success("File shared successfully");
          socket.emit("uploaded", {
            from: auth.user.email,
            to: email,
          });
          router.push("/myfiles");
        } else {
          toast.error("File upload failed");
        }
      }
    };
    req.send(formdata);
  };

  const removeFile = () => {
    setFile(null);
  };

  const viewFile = () => {};

  useEffect(() => {
    console.log(!auth.isAuth);
    if (auth.isAuth) {
      return router.push("/login");
    }
  }, []);

  return (
    <>
      <div>
        <Navbar />
      </div>
      <div className="relative min-h-screen flex items-center justify-center bg-white py-7 px-4 sm:px-6 lg:px-8 dark:bg-black bg-no-repeat bg-cover">
        <div className="absolute bg-white bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] bg-[size:25px_25px] dark:bg-gray-950 bg-[#000000] bg-[radial-gradient(#ffffff33_1px,#00091d_1px)] bg-[size:35px_35px] opacity-60 inset-0 z-0"></div>
        <div className="sm:max-w-lg w-full p-10 bg-white dark:bg-black rounded-xl z-10 shadow-xl shadow-indigo-500/40">
          <div className="text-center">
            <h2 className="mt-5 text-3xl font-medium text-gray-900 dark:text-gray-200">
              File Upload
            </h2>
          </div>
          <form className="mt-8 space-y-6" action="#" method="POST">
            <div className="grid grid-cols-1 space-y-2">
              <label className="text-md font-normal text-gray-900 dark:text-gray-200 tracking-wide">
                File Name
              </label>
              <input
                className="text-base p-2 border text-gray-900 dark:text-gray-200 rounded-lg focus:outline-none focus:border-gray-500"
                type="text"
                placeholder="your file name"
              />
            </div>
            <div className="grid grid-cols-1 space-y-2">
              <label className="text-md font-normal text-gray-900 dark:text-gray-200 tracking-wide">
                Receiver Email
              </label>
              <input
                className="text-base p-2 border text-gray-900 dark:text-gray-200 rounded-lg focus:outline-none focus:border-gray-500"
                type="email"
                placeholder="receiveremail@gmail.com"
              />
            </div>
            <div className="grid grid-cols-1 space-y-2">
              <label className="text-md font-normal text-gray-900 dark:text-gray-200 tracking-wide">
                Attach Document
              </label>
              <div className="flex items-center justify-center w-full">
                <label className="flex flex-col rounded-lg border-4 border-dashed w-full h-60 p-10 group text-center">
                  <div className="h-full w-full text-center flex flex-col justify-center items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-10 h-10 text-blue-400 group-hover:text-blue-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                      />
                    </svg>
                    <div className="flex flex-auto max-h-48 w-2/5 mx-auto -mt-10">
                      <Image
                        className="h-36 object-center"
                        src="https://img.freepik.com/free-vector/image-upload-concept-landing-page_52683-27130.jpg?size=338&ext=jpg"
                        alt="Upload Image"
                        width={100}
                        height={100}
                      />
                    </div>
                    <p className="pointer-none text-gray-500">
                      <span className="text-sm">Drag and drop</span> files here{" "}
                      <br /> or <input type="file" className="hidden" />{" "}
                      <span className="text-sky-400 hover:underline-offset-[3px]">
                        select{" "}
                      </span>
                      from your computer
                    </p>
                  </div>
                </label>
              </div>
            </div>
            <p className="text-sm text-gray-300">
              <span>File type: doc,pdf,types of images</span>
            </p>
            <div>
              <button
                type="submit"
                className="my-5 w-full flex justify-center bg-blue-500 text-gray-100 p-4  rounded-full tracking-wide
                                  font-semibold focus:multi-['outline-none;shadow-outline'] hover:bg-blue-600 shadow-lg cursor-pointer transition ease-in duration-300"
                onClick={handleUpload}
              >
                Upload
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default share;
