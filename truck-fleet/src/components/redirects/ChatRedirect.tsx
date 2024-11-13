"use client";
import { auth, db } from "@/lib/firebase";
import { redirect } from "@/lib/navigation";
import { doc } from "firebase/firestore";
import { notFound, useParams } from "next/navigation";
import { useAuthState } from "react-firebase-hooks/auth";
import { useDocumentData } from "react-firebase-hooks/firestore";

export default function ChatRedirect() {
	const [user, loading] = useAuthState(auth);
	const { chatId } = useParams();
	const [chatData, chatLoading] = useDocumentData(
		doc(db, "chats", chatId as string),
	);

	if (loading || chatLoading) return <></>;

	if (!user) {
		redirect("/login");
	}

	if (chatData === undefined) {
		notFound();
	}

	if (!chatData?.participants.includes(user?.uid)) {
		redirect("/dashboard/chat");
		return;
	}

	return <></>;
}
