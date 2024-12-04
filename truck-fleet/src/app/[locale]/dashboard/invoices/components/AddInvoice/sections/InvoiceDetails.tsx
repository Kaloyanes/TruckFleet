import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useInvoiceValuesStore } from "@/stores/Invoices/AddInvoiceValuesStore";
import { DatePickerInvoice } from "../DatePickerInvoice";
import InvoiceInput from "../InvoiceInput";
import InvoicePicture from "./InvoicePicture";

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
						tabIndex={1}
					/>
					{invoice.errors?.invoiceNumber && (
						<span className="ml-2 text-sm text-destructive">
							{invoice.errors.invoiceNumber}
						</span>
					)}
				</div>
				<div className="flex flex-1 items-center gap-1">
					<h1 className="font-semibold text-muted-foreground">Issue Date:</h1>
					<DatePickerInvoice
						tabIndex={2}
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
						tabIndex={3}
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
						onSave={invoice.setFrom}
						multiline
						rows={6}
						tabIndex={4}
					/>
					{invoice.errors?.from && (
						<span className="ml-2 text-sm text-destructive">
							{invoice.errors.from}
						</span>
					)}
				</div>
				<div className="flex-1">
					<h1 className="font-semibold text-muted-foreground">To:</h1>
					<InvoiceInput
						customerButton
						initialValue={invoice.to}
						onSave={invoice.setTo}
						multiline
						rows={6}
						tabIndex={5}
					/>
					{invoice.errors?.to && (
						<span className="ml-2 text-sm text-destructive">
							{invoice.errors.to}
						</span>
					)}
				</div>
			</div>
		</div>
	);
}
