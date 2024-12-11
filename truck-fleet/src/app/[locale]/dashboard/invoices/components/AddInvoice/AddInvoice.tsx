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
import { useSearchParam } from "react-use";
import { useSearchParams } from "next/navigation";

export function AddInvoice() {
	const { companyId } = useCompanyId();
	const t = useTranslations("InvoicesPage");
	const invoiceOptions = useInvoiceOptionsStore();
	const { load, open, openSheet, isLoading, createInvoice, isEditing } =
		useInvoiceValuesStore();

	useEffect(() => {
		let mounted = true;

		if (companyId && mounted) {
			load(companyId);
		}

		return () => {
			mounted = false;
		};
	}, [companyId, load]);

	return (
		<Sheet open={open} onOpenChange={openSheet}>
			<Tooltip delayDuration={300}>
				<TooltipTrigger asChild>
					<SheetTrigger asChild>
						<Button variant={"outline"} disabled={isLoading} size={"icon"}>
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
					<SheetTitle className="w-full flex-1">
						{isEditing ? t("editInvoice") : t("newInvoice")}
					</SheetTitle>
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
						onClick={() =>
							createInvoice(
								companyId,
								invoiceOptions.options.currency.code,
								invoiceOptions.options.dateFormat,
							)
						}
						className="min-w-20 max-w-48"
						type="submit"
					>
						{isEditing ? t("saveChanges") : t("createInvoice")}
					</Button>
				</SheetFooter>
			</SheetContent>
		</Sheet>
	);
}
