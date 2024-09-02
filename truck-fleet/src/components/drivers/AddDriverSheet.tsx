import React from "react";
import {
	Sheet,
	SheetClose,
	SheetContent,
	SheetDescription,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "../ui/button";
import { IconX } from "@tabler/icons-react";
import { useTranslations } from "next-intl";

export default function AddDriverSheet() {
	const t = useTranslations("AddOrderSheet");

	return (
		<Sheet>
			<SheetTrigger asChild>
				<Button>{t("addDriver")}</Button>
			</SheetTrigger>
			<SheetContent>
				<SheetHeader>
					<SheetTitle>{t("addDriver")}</SheetTitle>
					<SheetDescription>Add a new driver to your company.</SheetDescription>
				</SheetHeader>
			</SheetContent>
		</Sheet>
	);
}
