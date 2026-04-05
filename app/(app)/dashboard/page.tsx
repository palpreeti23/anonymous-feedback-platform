"use client";
import React, { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { isAcceptingMessageSchema } from "@/schemas/isAcceptingMessageSchema";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import axios, { AxiosError } from "axios";
import { ApiResponse } from "@/types/ApiResponse";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";

function Dashboard() {
  const [show, setShow] = useState(false);
  const [isSwitching, setIsSwitching] = useState(false);

  const { data: session, status } = useSession();
  const user = session?.user;
  const username = user?.username;

  const form = useForm({
    resolver: zodResolver(isAcceptingMessageSchema),
    defaultValues: {
      acceptMessage: true,
    },
  });

  const { register, setValue, watch } = form;
  const acceptMessages = watch("acceptMessage");

  const fetchAcceptMessage = useCallback(async () => {
    setIsSwitching(true);
    try {
      const response = await axios.get<ApiResponse>(`/api/accept-messages`);
      setValue("acceptMessage", response.data.isAcceptingMessages ?? true);
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      const errorMessage = axiosError.response?.data.message;
      toast(errorMessage || "failed to fetch message settings");
    } finally {
      setIsSwitching(false);
    }
  }, [setValue]);

  useEffect(() => {
    if (!session || !session.user) return;
    if (status === "authenticated") {
      fetchAcceptMessage();
    }
  }, [setValue, session, fetchAcceptMessage, status]);

  const handleSwitchChange = async () => {
    try {
      const response = await axios.post<ApiResponse>(`/api/accept-messages`, {
        acceptMessages: !acceptMessages,
      });
      setValue("acceptMessage", !acceptMessages);
      toast(response.data.message);
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      const errorMessage = axiosError.response?.data.message;
      toast(errorMessage || "failed to fetch message settings");
    }
  };

  if (status === "loading") {
    return <p>Loading...</p>;
  }

  if (!session || !session.user) {
    return <div>please login</div>;
  }

  const baseUrl = `${window.location.protocol}//${window.location.host}`;
  const profileUrl = `${baseUrl}/u/${username}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(profileUrl);
    toast.success("URL copied to clipboard");
  };

  return (
    <div className="w-full min-h-screen flex flex-col items-center pt-16">
      <div className="w-full md:w-2/3 bg-gray-50 shadow-2xl shadow-gray-300 rounded-2xl ">
        {" "}
        <div className="flex flex-col text-center py-6 space-y-4">
          <h2 className="text-xl md:text-3xl pt-10">Your Dashboarrd</h2>
          <p className="pb-6 px-2">
            Welcome to CipherTalk—send and receive messages anonymously
          </p>

          <div className="mb-4">
            <Switch
              {...register("acceptMessage")}
              checked={acceptMessages}
              onCheckedChange={handleSwitchChange}
              disabled={isSwitching}
            />
            <span className="ml-2">
              Accept Messages: {acceptMessages ? "On" : "Off"}
            </span>
          </div>
          <Separator />

          <div className="flex flex-col md:flex-row md:justify-center gap-8 my-4 w-full ">
            <Link href={`#`}>
              <button
                onClick={() => setShow(true)}
                className="bg-black text-white px-6 py-1 rounded shadow-lg shadow-black/20 border border-gray-300 "
              >
                Create New Link
              </button>
            </Link>
            <Link href={`/inbox`}>
              <button className="bg-white text-black py-1 px-6 rounded shadow-lg shadow-gray-300 border border-gray-300">
                Recieve Messages
              </button>
            </Link>
          </div>
          {show && (
            <div className="flex flex-col items-center">
              <div className="flex py-8 w-full md:w-1/2 px-8 ">
                <input
                  type="text"
                  className="w-full rounded-l-lg text-black py-1 px-3 border border-gray-400"
                  value={profileUrl}
                  disabled
                />
                <button
                  onClick={copyToClipboard}
                  className="px-3 rounded-r-lg bg-black text-white "
                >
                  Copy
                </button>
              </div>

              <p>Anyone with this link can send you message</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
