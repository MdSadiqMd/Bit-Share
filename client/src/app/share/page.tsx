"use client";

import React, { useState, useCallback, useMemo, useEffect } from "react";
import Image from "next/image";
import { useDropzone } from "react-dropzone";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { io } from "socket.io-client";
import { logIn, logOut } from "@/redux/features/auth.slice";
import { AppDispatch, useAppSelector } from "@/redux/store";
import { useDispatch } from "react-redux";
import Navbar from "@/components/ui/navbar";

let socket: any = null;
let apiurl: string = `${process.env.NEXT_PUBLIC_URL}`;

const Share = () => {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const auth = useAppSelector((state) => state.authReducer);
  const [file, setFile] = useState<any>(null);
  const [email, setEmail] = useState("");
  const [fileName, setFileName] = useState("");
  const [uploading, setUploading] = useState(false);
  const [uploadpercent, setUploadpercent] = useState(0);

  let onDrop = useCallback((acceptedFiles: any) => {
    if (acceptedFiles.length > 0) {
      setFile(acceptedFiles[0]);
    } else {
      toast.error("No file selected");
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  const generatepostobjecturl = async () => {
    let res = await fetch(
      process.env.NEXT_PUBLIC_URL + "/file/generatepostobjecturl",
      {
        method: "GET",
        credentials: "include",
      }
    );
    let data = await res.json();
    if (data.ok) {
      console.log(data.data.signedUrl);
      return data.data;
    } else {
      toast.error("Failed to generate post object url");
      return null;
    }
  };

  const uploadtos3byurl = async (url: string) => {
    try {
      setUploading(true);
      const options = {
        method: "PUT",
        body: file,
        headers: {
          "Content-Type": file.type,
          "Access-Control-Allow-Origin": "*",
          "x-amz-acl": "public-read",
        },
      };
      let res = await fetch(url, options);
      if (res.ok) {
        toast.success("File uploaded successfully");
        return true;
      } else {
        toast.error("Failed to upload file");
        return false;
      }
    } catch (error) {
      console.error("Error uploading to S3:", error);
      toast.error("Failed to upload file");
      return false;
    } finally {
      setUploading(false);
    }
  };

  const handleUpload = async () => {
    setUploading(true);
    let s3urlobj = await generatepostobjecturl();
    if (!s3urlobj) {
      setUploading(false);
      return;
    }
    let filekey = s3urlobj.filekey;
    let s3url = s3urlobj.signedUrl;
    console.log("fileKey: " + filekey);
    console.log("s3url: " + s3url);
    let uploaded = await uploadtos3byurl(s3url);
    console.log(uploaded);
    if (!uploaded) {
      setUploading(false);
      return;
    }
    toast.success("File uploaded successfully");
    let res = await fetch(process.env.NEXT_PUBLIC_URL + "/file/sharefile", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        senderEmail: auth?.user?.email,
        receiverEmail: email,
        filename: fileName,
        fileKey: filekey,
        fileType: file.type,
      }),
    });
    let data = await res.json();
    setUploading(false);
    if (data.ok) {
      toast.success("File shared successfully");
      // socket.emit('uploaded', {
      //   from: auth.user.email,
      //   to: email,
      // })
      router.push("/myfiles");
    } else {
      toast.error("Failed to share file");
    }
  };

  const removeFile = () => {
    setFile(null);
  };

  const viewFile = () => {};

  useEffect(() => {
    console.log(auth.isAuth);
    if (auth.isAuth) {
      return router.push("/login");
    }
  }, [auth?.isAuth, router]);

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
      <div className="relative min-h-screen flex items-center justify-center bg-white py-7 px-4 sm:px-6 lg:px-8 dark:bg-black bg-no-repeat bg-cover">
        <div className="absolute bg-white bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] bg-[size:25px_25px] dark:bg-gray-950 bg-[#000000] bg-[radial-gradient(#ffffff33_1px,#00091d_1px)] bg-[size:35px_35px] opacity-60 inset-0 z-0"></div>
        <div className="sm:max-w-lg w-full p-10 bg-white dark:bg-black rounded-xl z-10 shadow-xl shadow-indigo-500/40">
          <div className="text-center">
            <h2 className="mt-5 text-3xl font-medium text-gray-900 dark:text-gray-200">
              File Upload
            </h2>
          </div>
          <form className="mt-8 space-y-6" action={handleUpload} method="POST">
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
                {/* <label className="flex flex-col rounded-lg border-4 border-dashed w-full h-60 p-10 group text-center">
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
                </label> */}
                <input
                  className="text-base p-2 border text-gray-900 dark:text-gray-200 rounded-lg focus:outline-none focus:border-gray-500"
                  type="file"
                  placeholder="upload files to send"
                  onChange={(e) => {
                    if (e.target.files && e.target.files.length > 0) {
                      setFile(e.target.files[0]);
                    } else {
                      toast.error("Failed to select file");
                    }
                  }}
                />
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

export default Share;
