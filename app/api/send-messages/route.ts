import dbConnect from "@/lib/dbConnect";
import UserModel, { Message } from "@/model/User";

async function POST(req: Request) {
  await dbConnect();
  const { username, content } = await req.json();
  try {
    const user = await UserModel.findOne({ username });
    if (!user) {
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

    if (!user.isAcceptingMessages) {
      return Response.json(
        {
          success: false,
          message: "user id not accepting messages.",
        },
        {
          status: 400,
        },
      );
    }

    const newMessage = { content, createdAt: new Date() };
    user.messages.push(newMessage as Message);
    return Response.json(
      {
        success: true,
        message: "message send successfully.",
      },
      {
        status: 200,
      },
    );
  } catch (error) {
    console.log("error sending message", error);
    return Response.json(
      {
        success: false,
        message: "error sending message.",
      },
      {
        status: 401,
      },
    );
  }
}
