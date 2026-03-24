"use client";
import { signinSchema } from "@/schemas/signinSchema";
import React from "react";
import { useForm, Controller } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
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
import { signIn } from "next-auth/react";

function page() {
  const route = useRouter();

  const form = useForm({
    resolver: zodResolver(signinSchema),
    defaultValues: {
      identifier: "",
      password: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof signinSchema>) => {
    const result = await signIn("credentials", {
      redirect: false,
      identifier: data.identifier,
      password: data.password,
    });

    if (result?.error) {
      toast.error("error signing user");
    }
    if (result?.url) {
      route.replace(`/dashboard`);
    }
  };

  return (
    <div className="w-full h-screen bg-white">
      <div className="flex justify-center items-center text-gray-800">
        <div className="text-center">
          <h2>join Anonymouse platform</h2>
          <p>Sign in to Anonymouse platform</p>
        </div>

        <Card className="w-full sm:max-w-md">
          <CardHeader>
            <CardTitle>sign-in</CardTitle>
          </CardHeader>
          <CardContent>
            <form id="form-rhf-demo" onSubmit={form.handleSubmit(onSubmit)}>
              <FieldGroup>
                <Controller
                  name="identifier"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field>
                      <FieldLabel htmlFor="usernameField">
                        Username/Email
                      </FieldLabel>
                      <Input
                        {...field}
                        id="usernameField"
                        // aria-invalid={fieldState.invalid}
                        placeholder="Username/Email"
                      />
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

                <Button type="submit">signin</Button>
              </FieldGroup>
            </form>
          </CardContent>
          <div className="py-4 text-center flex">
            <p>
              don't have an account?{" "}
              <Link
                href={`/sign-up`}
                className="text-blue-500 hover:text-blue-800 ml-1"
              >
                sign-up
              </Link>
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}

export default page;
