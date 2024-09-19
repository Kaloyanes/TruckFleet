"use client";
import { useTranslations } from "next-intl";
import { Button } from "../../../../../components/ui/button";

import { locales } from "@/lib/i18n";
import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { IconLanguage } from "@tabler/icons-react";
import { usePathname } from "@/lib/navigation";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "../../../../../components/ui/dropdown-menu";

export default function LocaleSwitcher() {
	const [_, startTransition] = useTransition();

	const router = useRouter();
	const pathname = usePathname();

	const t = useTranslations("LocaleSwitcher");

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant="outline" size="icon">
					<IconLanguage />
					<span className="sr-only">Toggle theme</span>
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end" className="w-32">
				{locales.map((locale: string) => (
					<DropdownMenuItem
						key={locale}
						onClick={() => {
							startTransition(() => {
								router.replace(`/${locale}${pathname}`);
							});
						}}
					>
						{t(locale as "bg" | "en")}
					</DropdownMenuItem>
				))}
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
