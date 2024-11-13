"use client";
import { auth } from "@/lib/firebase";
import { redirect, usePathname } from "@/lib/navigation";
import { useAuthState } from "react-firebase-hooks/auth";
import { Spinner } from "../ui/loading-spinner";

export default function AuthRedirect() {
	const [user, loading] = useAuthState(auth);

	const pathName = usePathname();

	if (!loading) {
		if (!user) {
			redirect(
				`/login${pathName !== "/dashboard/sign-out" ? `?redirect=${pathName}` : ""}`,
			);
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
