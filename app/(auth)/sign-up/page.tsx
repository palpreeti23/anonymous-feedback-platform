"use client";
import { signupSchema } from "@/schemas/signupSchema";
import axios, { AxiosError } from "axios";
import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { ApiResponse } from "@/types/ApiResponse";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useDebounceCallback } from "usehooks-ts";
import { Loader2 } from "lucide-react";

function page() {
  const [username, setUsername] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [checkingUsername, setCheckingUsername] = useState(false);
  const [usernameMessage, setUsernameMessage] = useState("");
  const route = useRouter();
  const debounced = useDebounceCallback(setUsername, 300);

  const form = useForm({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
  });

  useEffect(() => {
    const checkUsernameUniqueness = async () => {
      if (username) {
        setCheckingUsername(true);
        setUsernameMessage("");

        try {
          const response = await axios.get(
            `/api/check-username-uniqueness/username?=${username}`,
          );
          setUsernameMessage(response.data?.message);
        } catch (error) {
          console.error("error checking username uniqueness");
          const axiosError = error as AxiosError<ApiResponse>;
          const errorMessage = axiosError.response?.data.message;
          setUsernameMessage(
            errorMessage ?? "error checking username uniqueness",
          );
        } finally {
          setCheckingUsername(false);
        }
      }
    };
    checkUsernameUniqueness();
  }, [username]);

  const onSubmit = async (data: z.infer<typeof signupSchema>) => {
    setIsSubmitting(true);
    try {
      const res = await axios.post<ApiResponse>(`/api/sign-up`, data);
      toast.success(res.data?.message);
      route.replace(`/verify/${username}`);
      setIsSubmitting(false);
    } catch (error) {
      console.error("error submitting sign-up data");
      const axiosError = error as AxiosError<ApiResponse>;
      const errorMessage = axiosError.response?.data.message;
      toast.error(errorMessage);
    }
  };
  return (
    <div className="w-full h-screen bg-white">
      <div className="flex justify-center items-center text-gray-800">
        <div className="text-center">
          <h2>join Anonymouse platform</h2>
          <p>Sign up to Anonymouse platform</p>
        </div>

        <Card className="w-full sm:max-w-md">
          <CardHeader>
            <CardTitle>sign-up</CardTitle>
          </CardHeader>
          <CardContent>
            <form id="form-rhf-demo" onSubmit={form.handleSubmit(onSubmit)}>
              <FieldGroup>
                <Controller
                  name="username"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field>
                      <FieldLabel htmlFor="usernameField">Username</FieldLabel>
                      <Input
                        {...field}
                        id="usernameField"
                        // aria-invalid={fieldState.invalid}
                        placeholder="Username"
                        onChange={(e) => {
                          field.onChange(e);
                          debounced(e.target.value);
                        }}
                      />
                      {checkingUsername && <Loader2 className="animate-spin" />}
                      <p
                        className={`${usernameMessage === "username is unique" ? "text-green-500" : "text-red-500"}`}
                      >
                        test {usernameMessage}
                      </p>
                    </Field>
                  )}
                />

                <Controller
                  name="email"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="emailField">email</FieldLabel>
                      <Input {...field} id="emailField" placeholder="Email" />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />

                <Controller
                  name="password"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="passwordField">password</FieldLabel>
                      <Input
                        {...field}
                        id="passwordField"
                        placeholder="password"
                      />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />

                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      please wait
                    </>
                  ) : (
                    "signup"
                  )}
                </Button>
              </FieldGroup>
            </form>
          </CardContent>
          <div className="py-4 text-center flex">
            <p>
              Already have an account?{" "}
              <Link
                href={`/sign-in`}
                className="text-blue-500 hover:text-blue-800 ml-1"
              >
                sign-in
              </Link>
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}

export default page;
