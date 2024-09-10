"use client";
import { ThemeToggle } from "@/components/settings/ThemeToggle";
import { db } from "@/firebase/firebase";
import { collection } from "firebase/firestore";
import {
	useCollection,
	useCollectionOnce,
} from "react-firebase-hooks/firestore";
import { useTranslations } from "next-intl";
import { unstable_setRequestLocale } from "next-intl/server";
import Link from "next/link";

export default function Home({
	params: { locale },
}: { params: { locale: string } }) {
	const t = useTranslations("Home");

	return (
		<main>
			<div className="absolute top-5 right-5">
				<ThemeToggle />
			</div>
			<h1>Truck Fleet</h1>
			<Link href="/dashboard">Go To Dashboard</Link>
		</main>
	);
}
