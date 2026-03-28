import dbConnect from "@/lib/dbConnect";
import bcrypt from "bcryptjs";
import UserModel from "@/model/User";
import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";

export async function POST(request: Request) {
  await dbConnect();
  try {
    const { username, email, password } = await request.json();

    const existingUserVerifiedByUsername = await UserModel.findOne({
      username,
    });

    if (existingUserVerifiedByUsername) {
      return Response.json(
        {
          success: false,
          message: "username is already taken",
        },
        {
          status: 400,
        },
      );
    }

    const existingUserVerifiedByEmail = await UserModel.findOne({ email });
    const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();

    if (existingUserVerifiedByEmail) {
      if (existingUserVerifiedByEmail.isVarified) {
        return Response.json(
          {
            success: false,
            message: "user already exist with this email",
          },
          {
            status: 400,
          },
        );
      } else {
        const hashPassword = await bcrypt.hash(password, 10);
        existingUserVerifiedByEmail.password = hashPassword;
        existingUserVerifiedByEmail.verifyCode = verifyCode;
        existingUserVerifiedByEmail.verifyCodeExpiry = new Date(
          Date.now() + 3600000,
        );

        await existingUserVerifiedByEmail.save();
      }
    } else {
      const hashPassword = await bcrypt.hash(password, 10);
      const expiryCode = new Date();
      expiryCode.setHours(expiryCode.getHours() + 1);
      const newUser = new UserModel({
        username,
        email,
        password: hashPassword,
        verifyCode,
        isVarified: false,
        verifyCodeExpiry: expiryCode,
        isAcceptingMessages: true,
        messages: [],
      });

      await newUser.save();
    }

    //send verification code
    const emailRes = await sendVerificationEmail(username, email, verifyCode);

    if (!emailRes.success) {
      return Response.json(
        {
          success: false,
          message: "error sending verification email",
        },
        {
          status: 400,
        },
      );
    }
    return Response.json(
      {
        success: true,
        message: "user successfully registered. please verify your account",
      },
      {
        status: 200,
      },
    );
  } catch (error) {
    console.log("error registering user", error);
    return Response.json(
      {
        success: false,
        message: "error registering user",
      },
      {
        status: 400,
      },
    );
  }
}
