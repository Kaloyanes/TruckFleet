import { Button } from "@/components/ui/button";
import { useInvoiceOptionsStore } from "@/stores/Invoices/AddInvoiceOptionsStore";
import { useInvoiceValuesStore } from "@/stores/Invoices/AddInvoiceValuesStore";
import NumberFlow from "@number-flow/react";
import { IconMinus, IconPlus } from "@tabler/icons-react";
import { AnimatePresence, LayoutGroup, motion } from "motion/react";
import { v4 as uuidv4 } from "uuid";
import FormattedNumberInput from "../FormattedNumberInput";
import InvoiceInput from "../InvoiceInput";

export default function InvoiceItems() {
	const invoice = useInvoiceValuesStore();
	const invoiceOptions = useInvoiceOptionsStore();

	return (
		<motion.div
			layout
			className="flex flex-col gap-4 pt-4"
			transition={{ duration: 0.2 }}
		>
			<motion.div
				layout // Add layout prop to the container
				className="flex flex-col gap-2"
				transition={{ delayChildren: 0.2, staggerChildren: 0.1 }}
			>
				{/* Header */}
				<motion.div
					layout
					className="grid gap-2 pr-4 font-mono font-semibold text-muted-foreground text-sm"
					style={{
						gridTemplateColumns: "repeat(14, minmax(0, 1fr))",
					}}
				>
					<div className="col-span-5">Description</div>
					<div className="col-span-2">Quantity</div>
					<div className="col-span-4">Price</div>
					<div className="col-span-3 flex justify-end">Final</div>
				</motion.div>

				{/* Items Container */}
				<LayoutGroup>
					<AnimatePresence mode="sync">
						<motion.div
							layout
							className="flex flex-col gap-2"
							transition={{ delayChildren: 0.2, staggerChildren: 0.1 }}
							style={{
								height: "auto",
							}}
							onSubmit={(e) => e.preventDefault()}
						>
							{invoice.errors?.items && (
								<span className="text-sm text-destructive">
									{invoice.errors.items}
								</span>
							)}
							{invoice.items.map((item, index) => (
								<motion.form
									onSubmit={(e) => e.preventDefault()}
									key={item.id}
									layout
									initial={{
										opacity: 0,
										y: 20,
										filter: "blur(10px)",
									}}
									animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
									exit={{
										opacity: 0,
										y: 20,
										filter: "blur(10px)",
									}}
									transition={{ duration: 0.2, type: "tween" }}
									className={`group relative grid gap-2 rounded-md py-2 pr-4 font-mono text-sm ${
										invoice.errors?.[`items.${index}`]
											? "border-destructive"
											: ""
									} hover:bg-accent/50`}
									style={{
										gridTemplateColumns: "repeat(14, minmax(0, 1fr))",
									}}
								>
									<div className="col-span-5">
										<InvoiceInput
											className="w-full"
											initialValue={item.description}
											onSave={(value) =>
												invoice.updateItem(item.id, {
													...item,
													description: value,
												})
											}
											tabIndex={20 + index * 3}
											error={invoice.errors?.[`items.${index}.description`]}
										/>
									</div>
									<div className="col-span-2 flex items-center justify-center gap-2">
										<FormattedNumberInput
											value={item.quantity}
											onChange={(value) =>
												invoice.updateItem(item.id, {
													...item,
													quantity: value,
												})
											}
											className="w-full"
											tabIndex={21 + index * 3}
											error={invoice.errors?.[`items.${index}.quantity`]}
										/>
									</div>
									<div className="col-span-4 flex justify-center">
										<FormattedNumberInput
											value={item.price}
											onChange={(value) =>
												invoice.updateItem(item.id, {
													...item,
													price: value,
												})
											}
											className="w-full"
											tabIndex={22 + index * 3}
											error={invoice.errors?.[`items.${index}.price`]}
										/>
									</div>
									<div className="col-span-3 flex w-full justify-end overflow-hidden">
										<NumberFlow
											value={item.price * item.quantity}
											className="font-semibold text-sm"
											format={invoiceOptions.getCurrencyFormat()}
											continuous={true}
										/>
									</div>

									{index !== 0 && (
										<Button
											variant="ghost"
											size="icon"
											tabIndex={invoice.tabIndex++}
											onClick={() => {
												invoice.removeItem(item.id);
											}}
											className="-right-5 absolute size-8 gap-2 text-foreground opacity-25 transition-all group-hover:opacity-100 focus:opacity-100"
										>
											<IconMinus size={15} />
										</Button>
									)}
								</motion.form>
							))}

							{/* Add Item Button */}
							<motion.div layout className="flex justify-start pt-2">
								<Button
									variant="ghost"
									size="sm"
									tabIndex={90}
									onClick={() => {
										invoice.addItem({
											id: uuidv4(),
											description: "",
											quantity: 0,
											price: 0,
										});
									}}
									className="gap-2 px-0 hover:bg-transparent"
								>
									<IconPlus size={16} />
									Add Item
								</Button>
							</motion.div>
						</motion.div>
					</AnimatePresence>
				</LayoutGroup>
			</motion.div>
		</motion.div>
	);
}
