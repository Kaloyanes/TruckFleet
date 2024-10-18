"use client";
import { auth } from "@/firebase/firebase";
import { redirect } from "@/lib/navigation";
import { useAuthState } from "react-firebase-hooks/auth";
import { Spinner } from "../ui/loading-spinner";

export default function ChatRedirect() {
	const [user, loading] = useAuthState(auth);

	if (!loading) {
		if (!user) {
			redirect("/login");
		}
	} else if (loading) {
		return (
			<div className="z-100 flex h-screen w-screen items-center justify-center">
				<Spinner size={"large"} />
			</div>
		);
	}

	return <></>;
}
