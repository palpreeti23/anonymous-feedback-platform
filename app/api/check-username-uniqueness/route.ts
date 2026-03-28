import UserModel from "@/model/User";
import dbConnect from "@/lib/dbConnect";
import { z } from "zod";
import { usernameValidation } from "@/schemas/signupSchema";

const usernameQuerySchema = z.object({
  username: usernameValidation,
});

export async function GET(request: Request) {
  await dbConnect();

  try {
    const { searchParams } = new URL(request.url);
    const queryParams = {
      username: searchParams.get("username"),
    };

    const result = usernameQuerySchema.safeParse(queryParams);
    if (!result.success) {
      return Response.json(
        {
          success: false,
          message: "invalid query params",
        },
        {
          status: 400,
        },
      );
    }
    const { username } = result.data;
    const existingUser = await UserModel.findOne({
      username,
      isVarified: true,
    });

    if (existingUser) {
      return Response.json(
        {
          success: false,
          message: "username already taken",
        },
        {
          status: 409,
        },
      );
    }

    return Response.json(
      {
        success: true,
        message: "username is unique",
      },
      {
        status: 200,
      },
    );
  } catch (error) {
    console.log("error checking username", error);
    return Response.json(
      {
        success: false,
        message: "error cheching username",
      },
      {
        status: 500,
      },
    );
  }
}
