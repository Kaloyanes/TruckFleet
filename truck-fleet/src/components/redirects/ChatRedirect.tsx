"use client";
import { auth } from "@/firebase/firebase";
import { redirect } from "@/lib/navigation";
import { useAuthState } from "react-firebase-hooks/auth";

export default function ChatRedirect() {
	const [user, loading] = useAuthState(auth);

	if (!loading) {
		if (!user) {
			redirect("/login");
		}
	} else if (loading) {
		return (
			<div className="absolute h-screen w-screen bg-background">
				<div className="flex justify-center items-center h-full w-full">
					<div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-primary" />
				</div>
			</div>
		);
	}

	return <></>;
}
