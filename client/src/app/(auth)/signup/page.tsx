"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
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
import { useState } from "react";
import { InputOTPForm } from "@/components/ui/otpForm";

interface FormData {
  name: string;
  email: string;
  password: string;
}

const signupForm = () => {
  const Router = useRouter();
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [otp, setOtp] = useState("");
  const [sendingOtp, setSendingOtp] = useState<boolean>(false);
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    password: "",
  } as FormData);
  const [isLoading, useIsLoading] = useState<Boolean>(true);
  const [isLoadingOTP, useIsLoadingOTP] = useState<Boolean>(true);

  const handleLoading = () => {
    useIsLoading(!isLoading);
  };

  const handleLoadingOTP = () => {
    useIsLoadingOTP(!isLoadingOTP);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const sendOTP = async () => {
    setSendingOtp(true);
    let res = await fetch(process.env.NEXT_PUBLIC_API_URL + "/auth/sendotp", {
      method: "POST",
      body: JSON.stringify({ email: formData.email }),
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });
    let data = await res.json();
    setSendingOtp(false);
    if (data.ok) {
      toast.success("OTP sent");
    } else {
      toast.error(data.message);
    }
  };

  return (
    <Card className="mx-auto max-w-md mt-[1.5%]">
      <CardHeader>
        <CardTitle className="text-xl">Sign Up</CardTitle>
        <CardDescription>
          Enter your information to create an account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 space-y-2">
          <div className="grid gap-2">
            <Label htmlFor="name">Name</Label>
            <Input id="name" placeholder="Enter your name"value={formData.name}
                onChange={handleInputChange} required />
          </div>
          <div className="grid grid-cols-3 gap-3 items-center">
            <div className="col-span-2 grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="youremail@gmail.com"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="col-span-1 flex mt-6 items-center justify-center">
              {isLoadingOTP ? (
                <Button onClick={() => {handleLoadingOTP(),sendOTP}} className="w-30">
                  Send OTP
                </Button>
              ) : (
                <Button disabled>
                  <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
                  Please wait
                </Button>
              )}
            </div>
          </div>
          <div className="grid gap-2">
            <InputOTPForm value={otp} onChange={(e:any)=>setOtp(e?.target?.value)} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" value={formData.password}
                onChange={handleInputChange}/>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="image">Your Profile Pic</Label>
            <Input id="image" type="file"/>
          </div>
          {isLoading ? (
            <Button
              onClick={() => handleLoading()}
              type="submit"
              className="w-full"
            >
              Create an Account
            </Button>
          ) : (
            <Button disabled>
              <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
              Please wait
            </Button>
          )}
        </div>
        <div className="mt-4 text-center text-sm">
          Already have an account?{" "}
          <Link href="/login" className="underline">
            Sign in
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};

export default signupForm;
