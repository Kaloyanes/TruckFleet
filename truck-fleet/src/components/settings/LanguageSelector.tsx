"use client";

import { useLocale } from "next-intl";
import { IconLanguage } from "@tabler/icons-react";
import { Button } from "../ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { routing, usePathname, useRouter } from "@/i18n/routing";
import { cn } from "@/lib/utils";

interface LanguageSelectorProps {
	className?: string;
}

export default function LanguageSelector({ className }: LanguageSelectorProps) {
	const locale = useLocale();

	const router = useRouter();
	const pathname = usePathname();

	const languages = [
		{ value: "en", label: "English" },
		{ value: "bg", label: "Български" },
	];

	const handleLanguageChange = (newLocale: string) => {
		// router.replace(`/${newLocale}${pathname}`);
		router.replace(pathname, { locale: newLocale });
	};

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant="outline" size="icon" className={cn(className)}>
					<IconLanguage className="h-4 w-4" />
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent>
				{languages.map((lang) => (
					<DropdownMenuItem
						key={lang.value}
						onClick={() => handleLanguageChange(lang.value)}
					>
						{lang.label}
					</DropdownMenuItem>
				))}
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
