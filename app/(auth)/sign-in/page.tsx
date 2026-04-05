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
import { Card, CardContent } from "@/components/ui/card";

import { Field, FieldError, FieldGroup } from "@/components/ui/field";
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
      toast.error("incorrect username or password");
      // console.error(error);
    }
    if (result?.url) {
      route.replace(`/dashboard`);
    }
  };

  return (
    <div className="flex justify-center items-center text-gray-800 min-h-screen ">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
        <div className="text-center py-4">
          <h2 className="text-3xl md:text-5xl mb-3">Join Anonymous Platform</h2>
          <p className="text-xl">sign in to anonymous platform</p>
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
                      <Input
                        {...field}
                        id="usernameField"
                        placeholder="Username/Email "
                        className="md:text-lg "
                      />
                    </Field>
                  )}
                />

                <Controller
                  name="password"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
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
                Sign-up
              </Link>
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}
export default page;
