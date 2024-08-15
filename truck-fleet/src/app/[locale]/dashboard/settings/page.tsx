import LocaleSwitcher from "@/components/settings/locale-switcher";
import { ThemeToggle } from "@/components/settings/theme-toggle";
import { unstable_setRequestLocale } from "next-intl/server";

export default function SettingsPage({
	params: { locale },
}: { params: { locale: string } }) {
	unstable_setRequestLocale(locale);

	return (
		<div className="p-24 flex flex-col gap-4 ">
			<h1>Settings</h1>
			<p>Settings page content</p>
			<LocaleSwitcher />
			<ThemeToggle />
		</div>
	);
}
