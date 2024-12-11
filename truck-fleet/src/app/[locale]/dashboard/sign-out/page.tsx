"use client";
import { useToast } from "@/components/ui/use-toast";
import { auth } from "@/lib/Firebase";
import { signOut } from "firebase/auth";
import { useTranslations } from "next-intl";
import { unstable_setRequestLocale } from "next-intl/server";
import React, { useEffect } from "react";

export default function SignOutPage() {
	const { toast } = useToast();

	const t = useTranslations("SignOutPage");

	async function signOutFromAccount() {
		await signOut(auth);
		toast({
			title: t("sign_out"),
			description: t("sign_out_description"),
			variant: "destructive",
		});
	}

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		signOutFromAccount();
	}, []);

	return <></>;
}
