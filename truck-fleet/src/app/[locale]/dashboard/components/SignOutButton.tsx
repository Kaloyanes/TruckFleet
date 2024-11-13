"use client";
import { auth } from "@/lib/firebase";
import { signOut } from "firebase/auth";
import { Button } from "../../../../components/ui/button";
import { useToast } from "../../../../components/ui/use-toast";

export default function SignOutButton() {
	const { toast } = useToast();

	async function signOutFromAccount() {
		await signOut(auth);
		toast({
			title: "Signed out",
			description: "You have successfully signed out.",
			variant: "destructive",
		});
	}

	return <Button onClick={() => signOutFromAccount()}>Sign out</Button>;
}
