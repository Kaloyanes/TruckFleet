"use client";
import useProfileDoc from "@/hooks/useProfileDoc";

export default function ProfilePage() {
	const { profile } = useProfileDoc();

	return <h1>{JSON.stringify(profile)}</h1>;
}
