import SignOutButton from "@/app/[locale]/dashboard/components/sign-out-button";
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
