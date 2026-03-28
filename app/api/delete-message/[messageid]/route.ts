import UserModel from "@/model/User";
import dbConnect from "@/lib/dbConnect";
import { auth } from "../../auth/[...nextauth]/option";
import { User } from "next-auth";

export async function DELETE(
  req: Request,
  { params }: { params: { messageid: string } },
) {
  await dbConnect();
  const session = await auth();
  const user: User = session?.user as User;

  if (!user || !session?.user) {
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

  const messageId = params.messageid;

  try {
    const res = await UserModel.updateOne(
      { _id: user._id },
      { $pull: { messages: { id: messageId } } },
    );

    if (res.modifiedCount == 0) {
      return Response.json(
        {
          success: false,
          message: "message not found or already deleted",
        },
        {
          status: 404,
        },
      );
    }

    return Response.json(
      {
        success: true,
        message: "message deleted successfully",
      },
      {
        status: 200,
      },
    );
  } catch (error) {
    console.log("error deleting message", error);
    return Response.json(
      {
        success: false,
        message: "error deletinn message",
      },
      {
        status: 500,
      },
    );
  }
}
