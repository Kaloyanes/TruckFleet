import SignOutButton from "@/components/dashboard/sign-out-button";
import { ThemeToggle } from "@/components/theme-toggle";
import { unstable_setRequestLocale } from "next-intl/server";

export default function DashboardPage({
	params: { locale },
}: { params: { locale: string } }) {
	unstable_setRequestLocale(locale);
	return (
		<div>
			<h1>Dashboard Page</h1>
			<SignOutButton />
		</div>
	);
}
