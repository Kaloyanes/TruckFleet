"use client";

import { Button } from "@/components/ui/button";
import {
	Sheet,
	SheetClose,
	SheetCloseButton,
	SheetContent,
	SheetDescription,
	SheetFooter,
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
import Image from "next/image";

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
			<SheetContent className="!max-w-2xl " showCloseButton={false}>
				<SheetHeader className="flex flex-row items-center gap-2">
					<SheetTitle className="w-full flex-1">{t("newInvoice")}</SheetTitle>
					<AddInvoiceOptions />
					<SheetCloseButton className="static" />
				</SheetHeader>
				{/* Add your invoice form content here */}
				<div className="my-3 h-[90%] rounded-lg bg-accent p-6">
					<div className="flex flex-col gap-3">
						<div className="flex flex-row items-center justify-between">
							<Image
								className="aspect-square rounded-lg object-cover"
								src="/kala.jpg"
								width={75}
								height={75}
								alt="Invoice Logo, Company Logo"
							/>
						</div>
						<div className="flex flex-row items-center justify-between font-mono text-sm">
							<div className="flex gap-1">
								<h1 className="font-semibold text-muted-foreground">
									Invoice No:
								</h1>
								<h3>INV-0001</h3>
							</div>
							<div className="flex gap-1 ">
								<h1 className="font-semibold text-muted-foreground">
									Issue Date:
								</h1>
								<h3>09/11/2024</h3>
							</div>
							<div className="flex gap-1">
								<h1 className="font-semibold text-muted-foreground">
									Due Date:
								</h1>
								<h3>09/11/2024</h3>
							</div>
						</div>
					</div>
				</div>
				{/* <SheetFooter className="flex justify-end">
					<Button variant="outline" size="sm" onClick={() => setOpen(false)}>
						Cancel
					</Button>
					<Button variant="default" size="sm">
						Save
					</Button>
				</SheetFooter> */}
				<SheetFooter className="z-[99999999] flex items-center justify-end gap-2">
					<SheetClose asChild>
						<Button
							type="button"
							className="min-w-20 max-w-32"
							variant="outline"
							size={"sm"}
						>
							{/* {t("cancel")} */}
							Cancel
						</Button>
					</SheetClose>
					<Button
						size={"sm"}
						onClick={() => {}}
						className="min-w-20 max-w-32"
						type="submit"
					>
						Save
					</Button>
				</SheetFooter>
			</SheetContent>
		</Sheet>
	);
}
