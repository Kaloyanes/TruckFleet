"use client";;
import { use } from "react";
import { ThemeToggle } from "@/components/settings/ThemeToggle";
import { useTranslations } from "next-intl";
import Link from "next/link";

export default function Home(props: { params: Promise<{ locale: string }> }) {
    const params = use(props.params);

    const {
        locale
    } = params;

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
