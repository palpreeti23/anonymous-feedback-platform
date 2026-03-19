import UserModel from "@/model/User";
import dbConnect from "@/lib/dbConnect";

async function POST(request: Request) {
  await dbConnect();

  try {
    const { username, code } = await request.json();
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

    const isVerifyCideCorrect = user.verifyCode == code;
    const isVerificationCodeExpired =
      new Date(user.verifyCodeExpiry) > new Date();

    if (isVerifyCideCorrect && isVerificationCodeExpired) {
      await user.save();
      return Response.json(
        {
          success: true,
          message: "user account verified successfully",
        },
        {
          status: 500,
        },
      );
    } else if (!isVerificationCodeExpired) {
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
