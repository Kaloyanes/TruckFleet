import SignOutButton from "@/app/[locale]/dashboard/components/SignOutButton";
import { unstable_setRequestLocale } from "next-intl/server";

export default function DashboardPage({
	params: { locale },
}: { params: { locale: string } }) {
	unstable_setRequestLocale(locale);
	return (
		<div className="h-20 flex w-20">
			<h1>Dashboard Page</h1>
			<SignOutButton />
		</div>
	);
}
