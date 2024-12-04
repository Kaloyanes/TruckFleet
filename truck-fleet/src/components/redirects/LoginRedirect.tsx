"use client";
import { auth } from "@/lib/firebase";
import { redirect, useSearchParams } from "next/navigation";
import { useAuthState } from "react-firebase-hooks/auth";
import { Spinner } from "../ui/loading-spinner";
import { useEffect } from "react";

export default function AuthRedirect() {
	const [user, loading] = useAuthState(auth);

	const searchParams = useSearchParams();

	useEffect(() => {
		if (!loading) {
			if (user) {
				const redirectTo = searchParams.get("redirect");
				if (redirectTo) {
					redirect(redirectTo);
				}

				redirect("/dashboard");
			}
		}
	});

	return <></>;
}
