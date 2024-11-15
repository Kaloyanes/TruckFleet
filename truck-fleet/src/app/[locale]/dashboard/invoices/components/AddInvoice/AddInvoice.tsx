"use client";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
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
import useCompanyId from "@/hooks/useCompanyId";
import { useInvoiceOptionsStore } from "@/stores/Invoices/InvoiceOptionsStore";
import { useInvoiceValuesStore } from "@/stores/Invoices/InvoiceValuesStore";
import NumberFlow, { type Format } from "@number-flow/react";
import { IconMinus, IconPlus } from "@tabler/icons-react";
import { AnimatePresence, LayoutGroup, motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";

import AddInvoiceOptions from "./AddInvoiceOptions";
import { DatePickerInvoice } from "./DatePickerInvoice";
import FormattedNumberInput from "./FormattedNumberInput";
import InvoiceInput from "./InvoiceInput";
import InvoicePicture from "./sections/InvoicePicture";
import InvoiceDetails from "./sections/InvoiceDetails";
import InvoiceItems from "./sections/InvoiceItems";
import InvoiceTotals from "./sections/InvoiceTotals";

export function AddInvoice() {
	const [open, setOpen] = useState(false);
	const { companyId } = useCompanyId();

	const t = useTranslations("InvoicesPage");

	const invoiceOptions = useInvoiceOptionsStore();
	const invoice = useInvoiceValuesStore();
	useEffect(() => {
		if (!companyId) return;
		invoice.load(companyId);
	}, [companyId, invoice.load]);

	const currencyFormat: Partial<Format> = {
		currency: invoiceOptions.options.currency.code,
		currencyDisplay: "symbol",
		style: "currency",
		roundingMode: "ceil",
		roundingIncrement: invoiceOptions.options.decimals ? 1 : 100,
		trailingZeroDisplay: invoiceOptions.options.decimals
			? "auto"
			: "stripIfInteger",
	};

	// if (invoice.isLoading) return <div>Loading...</div>;

	return (
		<Sheet open={open} onOpenChange={setOpen}>
			<Tooltip delayDuration={300}>
				<TooltipTrigger asChild>
					<SheetTrigger asChild>
						<Button
							variant={"outline"}
							disabled={invoice.isLoading}
							size={"icon"}
						>
							<IconPlus />
						</Button>
					</SheetTrigger>
				</TooltipTrigger>
				<TooltipContent>{t("newInvoice")}</TooltipContent>
			</Tooltip>
			<SheetContent
				autoFocus={false}
				className="!max-w-2xl "
				showCloseButton={false}
			>
				<SheetHeader className="flex flex-row items-center gap-2">
					<SheetTitle className="w-full flex-1">{t("newInvoice")}</SheetTitle>
					<AddInvoiceOptions />
					<SheetCloseButton className="static" />
				</SheetHeader>
				{/* Add your invoice form content here */}
				<div className="my-3 h-[90%] overflow-x-hidden overflow-y-scroll rounded-lg bg-accent p-6">
					<InvoiceDetails />
					{/* Items */}
					<InvoiceItems />
					{/* Totals */}
					<InvoiceTotals />
					{/* BANK DETAILS AND Notes */}
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
						</Button>
					</SheetClose>
					<Button
						size={"sm"}
						onClick={() => {
							console.log(invoice);
						}}
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
