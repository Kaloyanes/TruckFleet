"use client";

import AutoForm from "@/components/ui/auto-form";
import { Button } from "@/components/ui/button";
import { z } from "zod";

// Define your form schema using zod
const formSchema = z.object({
  email: z
    .string({
      required_error: "Email is required.",
    })
    .email({
      message: "Invalid email address.",
    })
    .min(2, {
      message: "Email must be at least 2 characters.",
    }),

  password: z
    .string({
      required_error: "Password is required.",
    })

    .describe("Your secure password")
    .min(8, {
      message: "Password must be at least 8 characters.",
    }),
});

export default function LoginForm() {
  return (
    <AutoForm
      formSchema={formSchema}
      onSubmit={(values) => console.log(values)}
    >
      <Button type="submit">Submit</Button>
    </AutoForm>
  );
}
