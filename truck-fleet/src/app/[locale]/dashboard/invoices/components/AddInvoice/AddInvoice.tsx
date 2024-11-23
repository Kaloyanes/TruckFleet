"use client";

import { useRef } from "react";
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
import useCompanyId from "@/hooks/useCompanyId";
import { useInvoiceOptionsStore } from "@/stores/Invoices/AddInvoiceOptionsStore";
import { useInvoiceValuesStore } from "@/stores/Invoices/AddInvoiceValuesStore";
import { IconPlus } from "@tabler/icons-react";
import { useTranslations } from "next-intl";
import { useEffect } from "react";

import AddInvoiceOptions from "./AddInvoiceOptions";
import InvoiceBankDetails from "./sections/InvoiceBankDetails";
import InvoiceDetails from "./sections/InvoiceDetails";
import InvoiceItems from "./sections/InvoiceItems";
import InvoiceTotals from "./sections/InvoiceTotals";

export function AddInvoice() {
	const { companyId } = useCompanyId();
	const initialLoadDone = useRef(false);

	const t = useTranslations("InvoicesPage");

	const invoiceOptions = useInvoiceOptionsStore();
	const invoice = useInvoiceValuesStore();

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		if (!companyId || initialLoadDone.current) return;
		initialLoadDone.current = true;
		invoice.load(companyId);
	}, [companyId]);

	// if (invoice.isLoading) return <div>Loading...</div>;

	return (
		<Sheet open={invoice.openSheet} onOpenChange={invoice.open}>
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
				tabIndex={-50}
				autoFocus={false}
				className="!max-w-2xl "
				showCloseButton={false}
			>
				<SheetHeader
					tabIndex={-51}
					className="flex flex-row items-center gap-2"
				>
					<SheetTitle className="w-full flex-1">{t("newInvoice")}</SheetTitle>
					<AddInvoiceOptions />
					<SheetCloseButton tabIndex={-3} className="static" />
				</SheetHeader>

				<div className="my-3 h-[90%] overflow-x-hidden overflow-y-scroll rounded-lg bg-accent p-6">
					<InvoiceDetails />
					{/* Items */}
					<InvoiceItems />
					{/* Totals */}
					<InvoiceTotals />
					{/* BANK DETAILS AND Notes */}
					<InvoiceBankDetails />
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
						onClick={() => invoice.createInvoice(companyId)}
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
