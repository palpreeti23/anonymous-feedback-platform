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

// Generate a consistent color from senderId
const stringToColor = (str: string) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const color = `hsl(${hash % 360}, 70%, 50%)`;
  return color;
};

// Simple anonymous pseudonyms (you can expand this list)
const pseudoNames = [
  "Anonymous Panda",
  "Silent Fox",
  "Mystery Cat",
  "Hidden Owl",
  "Secret Wolf",
  "Ghost Tiger",
];

const getPseudoName = (senderId: string) => {
  // pick one consistently based on senderId hash
  let hash = 0;
  for (let i = 0; i < senderId.length; i++) {
    hash = senderId.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % pseudoNames.length;
  return pseudoNames[index];
};

interface MessageCardProps {
  message: Message;
  onMessageDelete: (messageId: string) => void;
}

function MessageCard({ message, onMessageDelete }: MessageCardProps) {
  const handleDeleteConfirm = async () => {
    const result = await axios.delete(`/api/delete-message/${message._id}`);
    toast.success(result.data.message);
    onMessageDelete(message._id.toString());
  };

  const senderColor = stringToColor(message.userId); // fallback if no senderId
  const senderName = getPseudoName(message.userId);

  return (
    <div>
      <Card>
        <CardContent>
          {/* <p>{message.content}</p> */}
          <div className="flex items-start gap-3">
            {/* Profile icon */}
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center text-white flex-shrink-0 font-bold"
              style={{ backgroundColor: senderColor }}
            >
              {senderName[0]} {/* first letter of pseudonym */}
            </div>

            {/* Message content */}
            <div className="flex-1">
              <p className="font-semibold text-gray-800">{senderName}</p>
              <p className="text-gray-700">{message.content}</p>
              <p className="text-xs text-gray-400">
                {new Date(message.createdAt).toLocaleString()}
              </p>
            </div>
          </div>
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
