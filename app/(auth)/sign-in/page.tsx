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
    <div className="flex justify-center items-center text-gray-800 min-h-screen ">
      <div className="flex w-full flex-col items-center py-8 space-y-4 ">
        <div className="text-center py-4">
          <h2 className="text-3xl md:text-5xl mb-3">
            join Anonymouse platform
          </h2>
          <p className="text-xl">Sign in to Anonymouse platform</p>
        </div>

        <Card className="w-full sm:max-w-md py-8">
          <CardContent>
            <form id="form-rhf-demo" onSubmit={form.handleSubmit(onSubmit)}>
              <FieldGroup>
                <Controller
                  name="identifier"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field>
                      <FieldLabel
                        htmlFor="usernameField"
                        className="md:text-lg ml-2"
                      >
                        Username/Email
                      </FieldLabel>
                      <Input
                        {...field}
                        id="usernameField"
                        // aria-invalid={fieldState.invalid}
                        placeholder="Username/Email"
                        className="md:text-lg"
                      />
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

                <Button type="submit" className="md:text-lg">
                  signIn
                </Button>
              </FieldGroup>
            </form>
          </CardContent>
          <div className="py-4 text-left ml-6">
            <p className="text-lg">
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
