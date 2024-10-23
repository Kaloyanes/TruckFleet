import LocaleSwitcher from "@/app/[locale]/dashboard/settings/components/LocaleSwitcher";
import { ThemeToggle } from "@/components/settings/ThemeToggle";
import { unstable_setRequestLocale } from "next-intl/server";

export default async function SettingsPage(props: { params: Promise<{ locale: string }> }) {
    const params = await props.params;

    const {
        locale
    } = params;

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
