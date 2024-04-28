"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ReloadIcon } from "@radix-ui/react-icons";
import { logIn, logOut } from "@/redux/features/auth.slice";
import { AppDispatch, useAppSelector } from "@/redux/store";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { useState } from "react";
import { useRouter } from "next/navigation";

interface FormData {
  email: string;
  password: string;
}

const loginPage = () => {
  const router = useRouter();
  const auth = useAppSelector((state) => state.authReducer);
  const dispatch = useDispatch<AppDispatch>();
  const [isLoading, useIsLoading] = useState<Boolean>(true);
  const [formData, setFormData] = useState<FormData>({
    email: "",
    password: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleLogin = async () => {
    if (formData.email == "" || formData.password == "") {
      toast.error("Please fill all the fields");
      return;
    }
    let res = await fetch(process.env.NEXT_PUBLIC_URL + "/auth/login", {
      method: "POST",
      body: JSON.stringify({
        email: formData.email,
        password: formData.password,
      }),
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      credentials: "include",
    });

    let data = await res.json();
    if (data.ok) {
      toast.success("Login Success");
      getUserData();
    } else {
      toast.error(data.message);
    }
  };

  const getUserData = async () => {
    let res = await fetch(process.env.NEXT_PUBLIC_URL + "/auth/getuser", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      credentials: "include",
    });
    let data = await res.json();
    if (data.ok) {
      dispatch(logIn(data.data));
      router.push("/myfiles");
    } else {
      dispatch(logOut());
    }
  };

  const handleLoading = () => {
    useIsLoading(!isLoading);
  };

  return (
    <Card className="mx-auto max-w-sm mt-[10%] items-center justify-center">
      <CardHeader>
        <CardTitle className="text-2xl">Login</CardTitle>
        <CardDescription>
          Enter your email below to login to your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 space-y-3">
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="youremail@gmail.com"
              value={formData.email}
              onChange={(e) => handleInputChange(e)}
              required
            />
          </div>
          <div className="grid gap-2">
            <div className="flex items-center">
              <Label htmlFor="password">Password</Label>
            </div>
            <Input
              id="password"
              type="password"
              value={formData.password}
              onChange={(e: any) => {
                handleInputChange(e);
              }}
            />
          </div>
          {isLoading ? (
            <Button
              onClick={() => {
                handleLoading();
                handleLogin();
              }}
              type="submit"
              className="w-full"
            >
              Login
            </Button>
          ) : (
            <Button disabled>
              <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
              Please wait
            </Button>
          )}
        </div>
        <div className="mt-4 text-center text-sm">
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="underline">
            Sign up
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};

export default loginPage;
