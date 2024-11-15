import { motion } from "framer-motion";
import React from "react";
import InvoiceInput from "../InvoiceInput";
import { useInvoiceValuesStore } from "@/stores/Invoices/InvoiceValuesStore";

export default function InvoiceBankDetails() {
	const invoice = useInvoiceValuesStore();

	return (
		<motion.div layout className="flex pt-4">
			<div className="space-y-2 flex-1">
				<h1 className="font-semibold text-muted-foreground">Bank Details:</h1>
				<InvoiceInput
					initialValue={invoice.bankDetails}
					onSave={(value) => invoice.setBankDetails(value)}
					multiline
				/>
			</div>
			<div className="space-y-2 flex-1">
				<h1 className="font-semibold text-muted-foreground">Notes:</h1>
				<InvoiceInput
					initialValue={invoice.note}
					onSave={(value) => invoice.setNote(value)}
					multiline
				/>
			</div>
		</motion.div>
	);
}
