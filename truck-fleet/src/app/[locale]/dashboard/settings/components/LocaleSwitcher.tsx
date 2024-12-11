"use client";
import { useTranslations } from "next-intl";
import { Button } from "../../../../../components/ui/button";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { IconLanguage } from "@tabler/icons-react";
import { redirect, routing, usePathname } from "@/i18n/routing";
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
				{routing.locales.map((locale: string) => (
					<DropdownMenuItem
						key={locale}
						onClick={() => {
							router.replace(`/${locale}${pathname}`);
						}}
					>
						{t(locale as "bg" | "en")}
					</DropdownMenuItem>
				))}
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
