import { useInvoiceOptionsStore } from "@/stores/Invoices/InvoiceOptionsStore";
import { useInvoiceValuesStore } from "@/stores/Invoices/InvoiceValuesStore";
import NumberFlow from "@number-flow/react";
import { Separator } from "@radix-ui/react-select";
import { AnimatePresence, motion } from "framer-motion";
import FormattedNumberInput from "../FormattedNumberInput";
import InvoiceInput from "../InvoiceInput";

export default function InvoiceTotals() {
	const invoice = useInvoiceValuesStore();
	const invoiceOptions = useInvoiceOptionsStore();

	const sum = invoice.items
		.map((item) => item.price * item.quantity)
		.reduce((a, b) => a + b, 0);

	const vat = invoiceOptions.options.vat
		? (sum * (Number.isNaN(invoice.vat) ? 0 : (invoice.vat ?? 0))) / 100
		: 0;

	const discount = invoiceOptions.options.discount
		? (invoice.discount ?? 0)
		: 0;

	return (
		<motion.div layout layoutId="totals" className="flex flex-row pt-4">
			<div className="flex-1" />
			<div className="flex-1 space-y-2 font-semibold">
				<motion.div layout className="flex w-full justify-between">
					<h1 className="w-full text-muted-foreground">Subtotal:</h1>
					<div className="text-right">
						<NumberFlow
							value={sum}
							className="w-full"
							format={invoiceOptions.getCurrencyFormat()}
							continuous={true}
						/>
					</div>
				</motion.div>
				<div className="min-h-0.5">
					<AnimatePresence mode="sync" initial={false}>
						{invoiceOptions.options.vat && (
							<motion.div
								key="vat-container"
								variants={{
									hidden: {
										opacity: 0,
										y: 25,
										filter: "blur(10px)",
										scale: 0.8,
										height: 0,
									},
									visible: {
										opacity: 1,
										y: 0,
										filter: "blur(0px)",
										scale: 1,
										height: "auto",
									},
									exit: {
										opacity: 0,
										y: 25,
										filter: "blur(10px)",
										scale: 0.8,
										height: 0,
									},
								}}
								initial="hidden"
								animate="visible"
								exit="exit"
								className="overflow-hidden"
								layout
							>
								<motion.div>
									<div className="flex w-full justify-between py-1">
										<h1 className="flex w-full items-center text-muted-foreground">
											VAT{" "}
											<InvoiceInput
												initialValue={"20"}
												className="w-12 text-base"
												trailingSymbol="%"
												onSave={(value) =>
													invoice.setVat(Number.parseInt(value))
												}
												tabIndex={100} // VAT input
											/>
											:
										</h1>
										<div className="text-right">
											<NumberFlow
												value={vat}
												className="w-full"
												format={invoiceOptions.getCurrencyFormat()}
												continuous={true}
											/>
										</div>
									</div>
								</motion.div>
							</motion.div>
						)}
					</AnimatePresence>
				</div>
				<div className="min-h-0.5">
					<AnimatePresence mode="sync" initial={false}>
						{invoiceOptions.options.discount && (
							<motion.div
								key="discount-container"
								variants={{
									hidden: {
										opacity: 0,
										y: 25,
										filter: "blur(10px)",
										scale: 0.8,
										height: 0,
									},
									visible: {
										opacity: 1,
										y: 0,
										filter: "blur(0px)",
										scale: 1,
										height: "auto",
									},
									exit: {
										opacity: 0,
										y: 25,
										filter: "blur(10px)",
										scale: 0.8,
										height: 0,
									},
								}}
								initial="hidden"
								animate="visible"
								exit="exit"
								className="overflow-hidden"
								layout
							>
								<motion.div>
									<div className="flex w-full justify-between py-1">
										<h1 className="flex w-full items-center text-muted-foreground">
											Discount :
										</h1>
										<div className="text-right">
											<FormattedNumberInput
												value={invoice.discount}
												className="w-full text-right text-base"
												onChange={invoice.setDiscount}
												tabIndex={101}
											/>
										</div>
									</div>
								</motion.div>
							</motion.div>
						)}
					</AnimatePresence>
				</div>

				<motion.div layout className="pb-2">
					<Separator />
				</motion.div>
				<motion.div layout className="flex w-full justify-between">
					<h1 className="w-full text-muted-foreground">Total:</h1>
					<div className="text-right">
						<NumberFlow
							value={sum + vat - discount}
							className="w-full"
							format={invoiceOptions.getCurrencyFormat()}
							continuous={true}
						/>
					</div>
				</motion.div>
			</div>
		</motion.div>
	);
}
