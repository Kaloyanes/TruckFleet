"use client";
import { ThemeToggle } from "@/components/settings/ThemeToggle";
import { useTranslations } from "next-intl";
import Link from "next/link";

export default function HomePage() {
	const t = useTranslations("Home");

	return (
		<main>
			<div className="absolute top-5 right-5">
				<ThemeToggle />
			</div>
			<h1>{t("welcome")}</h1>
			<Link href="/dashboard">Go To Dashboard</Link>
		</main>
	);
}
