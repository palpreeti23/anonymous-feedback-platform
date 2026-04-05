"use client";
import React, { useCallback, useState, useEffect } from "react";
import { Message } from "@/model/User";
import MessageCard from "@/components/MessageCard";
import axios, { AxiosError } from "axios";
import { ApiResponse } from "@/types/ApiResponse";
import { toast } from "sonner";
import { useSession } from "next-auth/react";

function Inbox() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const { data: session, status } = useSession();

  const fetchMessage = useCallback(
    async (refresh: boolean = false) => {
      setLoading(true);
      try {
        const result = await axios.get<ApiResponse>(`/api/get-messages`);
        setMessages(result.data.messages || []);

        if (refresh) {
          toast.info("showing refreshed messages");
        }
      } catch (error) {
        const axiosError = error as AxiosError<ApiResponse>;
        const errorMessage = axiosError.response?.data.message;
        toast(errorMessage || "failed to fetch message settings");
      } finally {
        setLoading(false);
      }
    },
    [setMessages, setLoading],
  );

  useEffect(() => {
    if (!session || !session.user) return;
    if (status === "authenticated") {
      fetchMessage();
    }
  }, [session, fetchMessage, status]);

  const messageDeleteHandler = (messageId: string) => {
    setMessages(messages.filter((msg) => msg._id.toString() !== messageId));
  };
  return (
    <div className="w-full h-full flex flex-col text-left px-8 md:w-2/3 md:mx-auto overflow-y-auto no-scrollbar py-4">
      <h2 className="text-xl md:text-3xl py-4 ">
        Your Messages : <span className="">{messages.length}</span>
      </h2>
      <div className="w-full space-y-2 ">
        {messages.length > 0
          ? messages.map((msg, index) => (
              <MessageCard
                key={index}
                message={msg}
                onMessageDelete={messageDeleteHandler}
              />
            ))
          : "No Messages To Display"}
      </div>
    </div>
  );
}

export default Inbox;
