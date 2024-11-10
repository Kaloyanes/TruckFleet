"use client";

import { Button } from "@/components/ui/button";
import {
	Sheet,
	SheetClose,
	SheetCloseButton,
	SheetContent,
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
import { IconPlus } from "@tabler/icons-react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { useState } from "react";
import AddInvoiceOptions from "./AddInvoiceOptions";
import { DatePickerInvoice } from "./DatePickerInvoice";
import InvoiceInput from "./InvoiceInput";

export function AddInvoice() {
	const [open, setOpen] = useState(false);

	const t = useTranslations("InvoicesPage");

	const [issueDate, setIssueDate] = useState(new Date());
	const [dueDate, setDueDate] = useState(new Date());

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
					<div className="flex flex-col gap-10">
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
							<div className="flex flex-1 items-center gap-1">
								<h1 className="w-fit whitespace-nowrap font-semibold text-muted-foreground">
									Invoice No:
								</h1>
								<InvoiceInput
									initialValue={"INV-0001"}
									onSave={(value) => console.log(value)}
								/>
							</div>
							<div className="flex flex-1 items-center gap-1">
								<h1 className="font-semibold text-muted-foreground">
									Issue Date:
								</h1>
								<DatePickerInvoice date={issueDate} setDate={setIssueDate} />
							</div>
							<div className="flex flex-1 items-center gap-1">
								<h1 className="font-semibold text-muted-foreground">
									Due Date:
								</h1>
								<DatePickerInvoice date={dueDate} setDate={setDueDate} />
							</div>
						</div>
						<div className="flex flex-row items-center justify-between font-mono text-sm gap-2">
							<div className="flex-1">
								<h1 className="font-semibold text-muted-foreground">From:</h1>
								<InvoiceInput
									initialValue={"Kala"}
									onSave={(value) => console.log(value)}
									multiline
								/>
							</div>
							<div className="flex-1">
								<h1 className="font-semibold text-muted-foreground">To:</h1>
								<InvoiceInput
									initialValue={"Client"}
									onSave={(value) => console.log(value)}
									multiline
								/>
							</div>
						</div>
					</div>
				</div>

				<SheetFooter className="z-[99999999] flex items-center justify-end gap-2">
					<SheetClose asChild>
						<Button
							type="button"
							className="min-w-20 max-w-32"
							variant="outline"
							size={"sm"}
						>
							{t("cancel")}
							{/* Cancel */}
						</Button>
					</SheetClose>
					<Button
						size={"sm"}
						onClick={() => {}}
						className="min-w-20 max-w-32"
						type="submit"
					>
						{/* Save */}
						{t("createInvoice")}
					</Button>
				</SheetFooter>
			</SheetContent>
		</Sheet>
	);
}
