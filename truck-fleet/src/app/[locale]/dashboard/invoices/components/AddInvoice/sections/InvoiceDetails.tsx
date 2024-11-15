import React from "react";
import InvoicePicture from "./InvoicePicture";
import InvoiceInput from "../InvoiceInput";
import { useInvoiceValuesStore } from "@/stores/Invoices/InvoiceValuesStore";
import { DatePickerInvoice } from "../DatePickerInvoice";

export default function InvoiceDetails() {
	const invoice = useInvoiceValuesStore();

	return (
		<div className="space-y-10">
			<InvoicePicture />
			{/* Date and invoice number */}
			<div className="flex flex-row items-center justify-between font-mono text-sm">
				<div className="flex flex-1 items-center gap-1">
					<h1 className="w-fit whitespace-nowrap font-semibold text-muted-foreground">
						Invoice No:
					</h1>
					<InvoiceInput
						initialValue={invoice.invoiceNumber}
						onSave={invoice.setInvoiceNumber}
						tabIndex={0}
					/>
				</div>
				<div className="flex flex-1 items-center gap-1">
					<h1 className="font-semibold text-muted-foreground">Issue Date:</h1>
					<DatePickerInvoice
						date={invoice.issueDate}
						setDate={(date) => {
							invoice.setIssueDate(date);

							if (invoice.dueDate < date) {
								invoice.setDueDate(date);
							}
						}}
					/>
				</div>
				<div className="flex flex-1 items-center gap-1">
					<h1 className="font-semibold text-muted-foreground">Due Date:</h1>
					<DatePickerInvoice
						date={invoice.dueDate}
						setDate={invoice.setDueDate}
						startDate={invoice.issueDate}
					/>
				</div>
			</div>
			{/* From To Info */}
			<div className="flex flex-row items-center justify-between gap-2 font-mono text-sm">
				<div className="flex-1">
					<h1 className="font-semibold text-muted-foreground">From:</h1>
					<InvoiceInput
						initialValue={invoice.from}
						onSave={(value) => invoice.setFrom(value)}
						multiline
						rows={6}
						// biome-ignore lint/a11y/noPositiveTabindex: <explanation>
						tabIndex={1}
					/>
				</div>
				<div className="flex-1">
					<h1 className="font-semibold text-muted-foreground">To:</h1>
					<InvoiceInput
						customerButton
						onSave={(value) => console.log(value)}
						multiline
						rows={6}
						tabIndex={2}
					/>
				</div>
			</div>
		</div>
	);
}
