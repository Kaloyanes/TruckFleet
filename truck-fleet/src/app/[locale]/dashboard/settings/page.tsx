import LocaleSwitcher from "@/app/[locale]/dashboard/settings/components/LocaleSwitcher";
import { ThemeToggle } from "@/components/settings/ThemeToggle";
import { setRequestLocale } from "next-intl/server";

export default async function SettingsPage(props: { params: Promise<{ locale: string }> }) {
    const params = await props.params;

    const {
        locale
    } = params;

    setRequestLocale(locale);

    return (
		<div className="flex flex-col gap-4 ">
			<LocaleSwitcher />
			<ThemeToggle />
		</div>
	);
}
