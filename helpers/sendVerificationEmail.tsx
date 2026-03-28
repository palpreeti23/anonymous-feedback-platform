import React from "react";
import { resend } from "@/lib/resend";
import VerificationEmail from "@/emails/verificationEmail";
import { ApiResponse } from "@/types/ApiResponse";

export async function sendVerificationEmail(
  username: string,
  email: string,
  verifyCode: string,
): Promise<ApiResponse> {
  try {
    await resend.emails.send({
      from: "Acme <onboarding@resend.dev>",
      to: email,
      subject: "Verification Code",
      react: <VerificationEmail username={username} otp={verifyCode} />,
    });

    return { success: true, message: "verification code successfully send" };
  } catch (error) {
    console.log("error sending email", error);
    return { success: false, message: "Error sending verification code" };
  }
}
