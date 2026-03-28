import { Message } from "@/model/User";

export type ApiResponse = {
  message: string;
  success: boolean;
  messages?: Array<Message>;
  isAcceptingMessages?: boolean;
};
