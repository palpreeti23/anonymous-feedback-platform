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
            `/api/check-username-uniqueness?username=${username}`,
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
      toast.success(res?.data.message);
      route.replace(`/verify/${username}`);
      setIsSubmitting(false);
    } catch (error) {
      console.error("error in sign-up user", error);
      const axiosError = error as AxiosError<ApiResponse>;
      const errorMessage = axiosError.response?.data.message;
      toast.error(errorMessage);
      setIsSubmitting(false);
    }
  };
  return (
    <div className="flex justify-center items-center text-gray-800 min-h-screen ">
      <div className="flex w-full flex-col items-center py-8 space-y-4 ">
        <div className="text-center py-4">
          <h2 className="text-3xl md:text-5xl mb-3">
            join Anonymouse platform
          </h2>
          <p className="text-xl">Sign in to Anonymouse platform</p>
        </div>

        <Card className="w-full sm:max-w-md">
          <CardContent>
            <form id="form-rhf-demo" onSubmit={form.handleSubmit(onSubmit)}>
              <FieldGroup>
                <Controller
                  name="username"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field>
                      <FieldLabel
                        htmlFor="usernameField"
                        className="md:text-lg ml-2"
                      >
                        Username
                      </FieldLabel>
                      <Input
                        {...field}
                        id="usernameField"
                        aria-invalid={fieldState.invalid}
                        placeholder="Username"
                        className="md:text-lg "
                        onChange={(e) => {
                          field.onChange(e);
                          debounced(e.target.value);
                        }}
                      />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}

                      {checkingUsername && <Loader2 className="animate-spin" />}
                      <p
                        className={`md:text-lg ml-2 ${usernameMessage === "username is unique" ? "text-green-500" : "text-red-500"}`}
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
                      <FieldLabel
                        htmlFor="emailField"
                        className="md:text-lg ml-2"
                      >
                        email
                      </FieldLabel>
                      <Input
                        {...field}
                        id="emailField"
                        placeholder="Email"
                        className="md:text-lg "
                      />
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
                      <FieldLabel
                        htmlFor="passwordField"
                        className="md:text-lg ml-2"
                      >
                        password
                      </FieldLabel>
                      <Input
                        {...field}
                        id="passwordField"
                        placeholder="password"
                        className="md:text-lg"
                      />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="md:text-lg ml-2"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      please wait
                    </>
                  ) : (
                    "Signup"
                  )}
                </Button>
              </FieldGroup>
            </form>
          </CardContent>
          <div className="pb-4 text-left ml-6">
            <p className="text-lg">
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
