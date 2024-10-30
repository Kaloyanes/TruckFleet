"use client";
import { auth } from "@/firebase/firebase";
import { redirect } from "@/lib/navigation";
import { useSearchParams } from "next/navigation";
import { useAuthState } from "react-firebase-hooks/auth";
import { Spinner } from "../ui/loading-spinner";

export default function AuthRedirect() {
	const [user, loading] = useAuthState(auth);

	const searchParams = useSearchParams();

	if (!loading) {
		if (user) {
			const redirectTo = searchParams.get("redirect");
			if (redirectTo) {
				redirect(redirectTo);
				return;
			}

			redirect("/dashboard");
		}
	} else if (loading) {
		return (
			<div className="z-100 flex h-screen w-screen items-center justify-center">
				<Spinner />
			</div>
		);
	}

	return <></>;
}
