"use client";
import React from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "./ui/button";
import axios from "axios";
import { toast } from "sonner";
import { Message } from "@/model/User";

interface MessageCardProps {
  message: Message;
  onMessageDelete: (messageId: string) => void;
}

function MessageCard({ message, onMessageDelete }: MessageCardProps) {
  // const handleDeleteConfirm = async () => {
  //   const result = await axios.delete(`/api/delete-message/${message._id}`);
  //   toast.success(result.data.message);
  //   onMessageDelete(message._id.toString());
  // };

  const handleDeleteConfirm = async () => {
    try {
      const result = await axios.delete(`/api/delete-message/${message._id}`);
      toast.success(result.data.message);
      onMessageDelete(message._id.toString());
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to delete message");
    }
  };
  return (
    <div>
      <Card>
        <CardContent>
          <p>{message.content}</p>
        </CardContent>
        <CardFooter>
          <Dialog>
            <DialogTrigger>Delete</DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Are you absolutely sure?</DialogTitle>
                <DialogDescription>
                  This action cannot be undone. This will permanently delete
                  your account and remove your data from our servers.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="outline">Cancel</Button>
                </DialogClose>
                <Button onClick={handleDeleteConfirm}>Continue</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </CardFooter>
      </Card>
    </div>
  );
}

export default MessageCard;
