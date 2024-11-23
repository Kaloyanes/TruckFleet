import { useInvoiceValuesStore } from "@/stores/Invoices/AddInvoiceValuesStore";
import { motion } from "framer-motion";
import InvoiceInput from "../InvoiceInput";

export default function InvoiceBankDetails() {
	const invoice = useInvoiceValuesStore();

	return (
		<motion.div layout className="flex pt-4">
			<div className="space-y-2 flex-1">
				<h1 className="font-semibold text-muted-foreground">Bank Details:</h1>
				<InvoiceInput
					tabIndex={110}
					initialValue={invoice.bankDetails}
					onSave={(value) => invoice.setBankDetails(value)}
					multiline
				/>
			</div>
			<div className="space-y-2 flex-1">
				<h1 className="font-semibold text-muted-foreground">Notes:</h1>
				<InvoiceInput
					tabIndex={111}
					initialValue={invoice.note}
					onSave={(value) => invoice.setNote(value)}
					multiline
				/>
			</div>
		</motion.div>
	);
}
