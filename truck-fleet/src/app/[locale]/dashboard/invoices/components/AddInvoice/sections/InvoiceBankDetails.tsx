import { useInvoiceValuesStore } from "@/stores/Invoices/AddInvoiceValuesStore";
import { motion } from "motion/react";
import InvoiceInput from "../InvoiceInput";

export default function InvoiceBankDetails() {
	const invoice = useInvoiceValuesStore();

	return (
		<>
			<motion.div layout className="flex pt-4 gap-2">
				<div className="space-y-2 flex-1">
					<h1 className="font-semibold text-muted-foreground">Bank Details:</h1>
					<InvoiceInput
						tabIndex={110}
						initialValue={invoice.bankDetails}
						onSave={(value) => invoice.setBankDetails(value)}
						multiline
						error={invoice.errors?.bankDetails}
					/>
					{invoice.errors?.bankDetails && (
						<span className="text-sm text-destructive">
							{invoice.errors.bankDetails}
						</span>
					)}
				</div>
				<div className="space-y-2 flex-1">
					<h1 className="font-semibold text-muted-foreground">Deal Details:</h1>
					<InvoiceInput
						tabIndex={111}
						initialValue={invoice.dealDetails}
						onSave={(value) => invoice.setDealDetails(value)}
						multiline
						error={invoice.errors?.dealDetails}
					/>
				</div>
			</motion.div>
			<motion.div layout className="flex pt-4 gap-2">
				<div className="space-y-2 flex-1">
					<h1 className="font-semibold text-muted-foreground">Note:</h1>
					<InvoiceInput
						tabIndex={112}
						initialValue={invoice.note}
						onSave={(value) => invoice.setNote(value)}
						multiline
						error={invoice.errors?.note}
					/>
				</div>
			</motion.div>
		</>
	);
}
