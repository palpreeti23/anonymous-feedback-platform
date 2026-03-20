import UserModel from "@/model/User";
import dbConnect from "@/lib/dbConnect";
import { useSession } from "next-auth/react";
import { User } from "next-auth";
import mongoose from "mongoose";

export async function GET(req: Request) {
  await dbConnect();

  const { data: session } = useSession();
  const user = session?.user;
  if (!user || !session.user) {
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

  const userId = new mongoose.Types.ObjectId(user._id);

  try {
    const result = await UserModel.aggregate([
      { $match: { _id: userId } },
      { $unwind: { path: "$messages", preserveNullAndEmptyArrays: true } },
      { $sort: { "messages.createdAt": -1 } },
      { $group: { _id: "$_id", messages: { $push: "messages" } } },
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
        message: result[0].message,
      },
      {
        status: 500,
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
