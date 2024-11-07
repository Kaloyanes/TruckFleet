"use client";

import { Button } from "@/components/ui/button";
import {
	Sheet,
	SheetClose,
	SheetCloseButton,
	SheetContent,
	SheetDescription,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from "@/components/ui/sheet";
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { IconDotsVertical, IconPlus } from "@tabler/icons-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import AddInvoiceOptions from "./AddInvoiceOptions";

export function AddInvoice() {
	const [open, setOpen] = useState(false);

	const t = useTranslations("InvoicesPage");

	return (
		<Sheet open={open} onOpenChange={setOpen}>
			<Tooltip delayDuration={300}>
				<TooltipTrigger asChild>
					<SheetTrigger asChild>
						<Button variant={"outline"} size={"icon"}>
							<IconPlus />
						</Button>
					</SheetTrigger>
				</TooltipTrigger>
				<TooltipContent>{t("newInvoice")}</TooltipContent>
			</Tooltip>
			<SheetContent showCloseButton={false}>
				<SheetHeader className="flex flex-row items-center gap-2">
					<SheetTitle className="w-full flex-1">{t("newInvoice")}</SheetTitle>
					<AddInvoiceOptions />
					<SheetCloseButton className="static" />
				</SheetHeader>
				{/* Add your invoice form content here */}
			</SheetContent>
		</Sheet>
	);
}
