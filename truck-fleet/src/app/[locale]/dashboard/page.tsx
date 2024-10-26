import SignOutButton from "@/app/[locale]/dashboard/components/SignOutButton";
import { setRequestLocale, unstable_setRequestLocale } from "next-intl/server";

export default async function DashboardPage({
	params: { locale },
}: {
	params: { locale: string };
}) {
	setRequestLocale(locale);
	return (
		<div className="h-20 flex w-20">
			<h1>Dashboard Page</h1>
			<SignOutButton />
		</div>
	);
}
