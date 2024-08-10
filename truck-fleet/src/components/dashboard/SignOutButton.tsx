"use client";
import { auth } from "@/firebase/firebase";
import { signOut } from "firebase/auth";
import { Button } from "../ui/button";

async function signOutFromAccount() {
	await signOut(auth);
}

export default function SignOutButton() {
	return <Button onClick={() => signOutFromAccount()}>Sign out</Button>;
}
