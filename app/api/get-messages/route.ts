import UserModel from "@/model/User";
import dbConnect from "@/lib/dbConnect";
import { User } from "next-auth";
import mongoose from "mongoose";
import { auth } from "../auth/[...nextauth]/option";

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

  const userId = new mongoose.Types.ObjectId(user._id);

  try {
    const result = await UserModel.aggregate([
      { $match: { _id: userId } },
      { $unwind: { path: "$messages", preserveNullAndEmptyArrays: true } },
      { $sort: { "messages.createdAt": -1 } },
      { $group: { _id: "$_id", messages: { $push: "$messages" } } },
    ]);

    // console.log("API RESPONSE", result.data);

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
        messages: result[0].messages,
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
