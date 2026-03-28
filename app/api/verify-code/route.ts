import UserModel from "@/model/User";
import dbConnect from "@/lib/dbConnect";

export async function POST(request: Request) {
  await dbConnect();

  try {
    const { username, code } = await request.json();
    console.log("Received username:", username, "code:", code);
    const decodedUsername = decodeURIComponent(username);
    const user = await UserModel.findOne({ username: decodedUsername });
    if (!user) {
      return Response.json(
        {
          success: false,
          message: "user not found",
        },
        {
          status: 400,
        },
      );
    }

    const isCodeValid = user.verifyCode === code;
    const isCodeNotExpired = new Date(user.verifyCodeExpiry) > new Date();

    if (isCodeValid && isCodeNotExpired) {
      user.isVarified = true;
      await user.save();
      return Response.json(
        {
          success: true,
          message: "user account verified successfully",
        },
        {
          status: 200,
        },
      );
    } else if (!isCodeNotExpired) {
      return Response.json(
        {
          success: false,
          message:
            "your verification code has been expired. signin again to get a new code",
        },
        {
          status: 400,
        },
      );
    } else {
      return Response.json(
        {
          success: false,
          message: "incorrect password!",
        },
        {
          status: 401,
        },
      );
    }
  } catch (error) {
    console.log("error verifying user", error);
    return Response.json(
      {
        success: false,
        message: "error verifying user",
      },
      {
        status: 405,
      },
    );
  }
}
