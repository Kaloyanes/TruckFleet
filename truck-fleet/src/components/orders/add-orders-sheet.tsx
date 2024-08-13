import React from "react";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "../ui/sheet";
import { Button } from "../ui/button";
import { useTranslations } from "next-intl";

export default function AddOrdersSheet() {
	const t = useTranslations("AddOrderSheet");
	return (
		<Sheet>
			<SheetTrigger>
				<Button>{t("title")}</Button>
			</SheetTrigger>
			<SheetContent>
				<SheetTitle>{t("title")}</SheetTitle>
			</SheetContent>
		</Sheet>
	);
}
