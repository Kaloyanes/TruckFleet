import LocaleSwitcher from "@/app/[locale]/dashboard/settings/components/LocaleSwitcher";
import { ThemeToggle } from "@/components/settings/ThemeToggle";
import { setRequestLocale, unstable_setRequestLocale } from "next-intl/server";

export default async function SettingsPage({
	params: { locale },
}: { params: { locale: string } }) {
	setRequestLocale(locale);

	return (
		<div className="flex flex-col gap-4 p-24 ">
			<h1>Settings</h1>
			<p>Settings page content</p>
			<LocaleSwitcher />
			<ThemeToggle />
		</div>
	);
}
