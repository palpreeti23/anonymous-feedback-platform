"use client";
import { useForm, Controller } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useParams, useRouter } from "next/navigation";
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
import { verifySchema } from "@/schemas/verifySchema";
import axios, { AxiosError } from "axios";
import { ApiResponse } from "@/types/ApiResponse";

function page() {
  const route = useRouter();
  const param = useParams<{ username: string }>();
  const username = param.username;
  const form = useForm({
    resolver: zodResolver(verifySchema),
  });

  const onSubmit = async (data: z.infer<typeof verifySchema>) => {
    try {
      const result = await axios.post<ApiResponse>(`/api/verify-code`, {
        username: username,
        code: data.code,
      });
      toast.success(result?.data.message);
      route.replace(`/sign-in`);
    } catch (error) {
      console.log("error in sign-in user", error);
      const axiosError = error as AxiosError<ApiResponse>;
      const errorMsg = axiosError.response?.data.message;
      toast.error(errorMsg);
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
                  name="code"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field>
                      <FieldLabel
                        htmlFor="codeField"
                        className="md:text-lg ml-2"
                      >
                        Code
                      </FieldLabel>
                      <Input
                        {...field}
                        id="codeField"
                        // aria-invalid={fieldState.invalid}
                        placeholder="Code"
                        className="md:text-lg "
                      />
                    </Field>
                  )}
                />

                <Button type="submit" className="md:text-lg ">
                  submit
                </Button>
              </FieldGroup>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default page;
