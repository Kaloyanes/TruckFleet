"use client";

import AutoForm from "@/components/ui/auto-form";
import { Button } from "@/components/ui/button";
import { EyeIcon, EyeOff } from "lucide-react";
import { useState } from "react";
import { z } from "zod";
import ForgotPasswordDialog from "./ForgotPasswordDialog";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/firebase/firebase";
import { useToast } from "../ui/use-toast";
import type { FirebaseError } from "firebase/app";
import { redirect } from "next/navigation";
import { useRouter } from "next/navigation";

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
	const [showPassword, setShowPassword] = useState(false);
	const { toast } = useToast();
	const router = useRouter();

	async function signIn(values: { email: string; password: string }) {
		console.log(values);
		try {
			await signInWithEmailAndPassword(auth, values.email, values.password);
		} catch (e: unknown) {
			console.error((e as FirebaseError).message);
			toast({
				title: "Error",
				description: (e as FirebaseError).message,
				variant: "destructive",
			});
		}

		toast({
			title: "Success",
			description: "You have successfully signed in.",
			variant: "success",
		});

		// router.replace("/dashboard");
	}

	return (
		<AutoForm
			className="flex flex-col gap-2"
			formSchema={formSchema}
			onSubmit={signIn}
			fieldConfig={{
				password: {
					inputProps: {
						type: showPassword ? "text" : "password",
					},
					renderParent: ({ children }) => {
						return (
							<div className="relative">
								{children}
								<Button
									size={"icon"}
									onClick={() => setShowPassword(!showPassword)}
									className="absolute right-0 top-[22px] hover:translate-y-0 "
									variant={"outline"}
								>
									{showPassword ? <EyeOff /> : <EyeIcon />}
								</Button>
							</div>
						);
					},
				},
			}}
		>
			<ForgotPasswordDialog />
			<Button type="submit" className="w-full">
				Submit
			</Button>
		</AutoForm>
	);
}
