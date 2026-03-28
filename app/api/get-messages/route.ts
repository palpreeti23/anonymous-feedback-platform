import UserModel from "@/model/User";
import dbConnect from "@/lib/dbConnect";
import { useSession } from "next-auth/react";
import { User } from "next-auth";
import mongoose from "mongoose";
import { auth } from "../auth/[...nextauth]/option";
import { string } from "zod";

export async function GET(req: Request) {
  await dbConnect();

  const session = await auth();
  const user: User = session?.user as User;

  if (!user || !session?.user) {
    return Response.json(
      {
        success: false,
        message: "user not authenticated",
      },
      {
        status: 401,
      },
    );
  }

  // const userId = new mongoose.Types.ObjectId(user._id);
  // const userDoc = await UserModel.findById(userId);
  // console.log("USER DOC:", userDoc);

  const rawId = user._id;

  // Validate user._id
  if (typeof rawId !== "string" || !mongoose.Types.ObjectId.isValid(rawId)) {
    return Response.json(
      { success: false, message: "invalid user ID" },
      { status: 400 },
    );
  }
  console.log("session user._id:", user._id, typeof user._id);

  const userId = rawId; // keep it as string

  try {
    const userDoc = await UserModel.findById(userId);
    if (!userDoc) {
      return Response.json(
        { success: false, message: "user not found" },
        { status: 404 },
      );
    }

    const result = await UserModel.aggregate([
      { $match: { _id: userId } },
      { $unwind: { path: "$messages", preserveNullAndEmptyArrays: true } },
      { $sort: { "messages.createdAt": -1 } },
      { $group: { _id: "$_id", messages: { $push: "$messages" } } },
    ]);

    if (!result || result.length === 0) {
      return Response.json(
        {
          success: false,
          message: "user not found",
        },
        {
          status: 404,
        },
      );
    }

    return Response.json(
      {
        success: true,
        message: result[0].messages,
      },
      {
        status: 200,
      },
    );
  } catch (error) {
    console.log("user not found", error);
    return Response.json(
      {
        success: false,
        message: "user not found",
      },
      {
        status: 401,
      },
    );
  }
}
