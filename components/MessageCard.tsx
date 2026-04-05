"use client";
import { Card, CardContent } from "@/components/ui/card";
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
  const timeAgo = (date: Date | string) => {
    const now = new Date();
    const created = new Date(date);
    const seconds = Math.floor((now.getTime() - created.getTime()) / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(seconds / 3600);
    const days = Math.floor(seconds / 86400);
    const weeks = Math.floor(days / 7);
    // const months = Math.floor(weeks / 4);

    if (seconds < 60) return "Just Now";
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    if (weeks < 4) return `${weeks}w ago`;
  };

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
    <div className="w-full">
      <Card>
        <CardContent className="flex justify-between">
          <div className="flex">
            <div className="h-8 w-8 rounded-full">
              <img
                src={`https://api.dicebear.com/7.x/bottts/svg?seed=${message._id}`}
                alt="Anonymous avatar"
                className="w-full h-full rounded-full"
              />
            </div>
            <p className="text-lg pl-5 ">{message.content}</p>
          </div>

          <div className="flex gap-5">
            <span className="pt-1 text-blue-500">
              {timeAgo(message.createdAt)}
            </span>
            <Dialog>
              <DialogTrigger className="hover:text-red-500 cursor-pointer">
                ✖
              </DialogTrigger>
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
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default MessageCard;
