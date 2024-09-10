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
import { redirect } from "@/lib/navigation";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

// Define your form schema using zod

export default function LoginForm() {
	const t = useTranslations("LoginPage");

	const formSchema = z.object({
		email: z
			.string({
				required_error: "Email is required.",
			})
			.describe(t("email"))
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

			.describe(t("password"))
			.min(8, {
				message: "Password must be at least 8 characters.",
			}),
	});

	const [showPassword, setShowPassword] = useState(false);
	const { toast } = useToast();
	const router = useRouter();

	async function signIn(values: { email: string; password: string }) {
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
			title: t("success"),
			description: t("signed_in"),
			variant: "success",
		});
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
				{t("submit")}
			</Button>
		</AutoForm>
	);
}
