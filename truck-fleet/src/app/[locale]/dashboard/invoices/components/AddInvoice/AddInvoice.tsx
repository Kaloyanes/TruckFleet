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
import { useInvoiceOptionsStore } from "@/stores/Invoices/InvoiceOptionsStore";
import { useInvoiceValuesStore } from "@/stores/Invoices/InvoiceValuesStore";
import NumberFlow, { type Format } from "@number-flow/react";
import { IconMinus, IconPlus } from "@tabler/icons-react";
import { AnimatePresence, LayoutGroup, motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import AddInvoiceOptions from "./AddInvoiceOptions";
import { DatePickerInvoice } from "./DatePickerInvoice";
import FormattedNumberInput from "./FormattedNumberInput";
import InvoiceInput from "./InvoiceInput";
import InvoicePicture from "./InvoicePicture";

export function AddInvoice() {
	const [open, setOpen] = useState(false);

	const t = useTranslations("InvoicesPage");

	const invoiceOptions = useInvoiceOptionsStore();
	const invoice = useInvoiceValuesStore();

	const sum = invoice.items
		.map((item) => item.price * item.quantity)
		.reduce((a, b) => a + b, 0);

	const vat = invoiceOptions.options.vat
		? (sum * (Number.isNaN(invoice.vat) ? 0 : (invoice.vat ?? 0))) / 100
		: 0;

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

	return (
		<Sheet open={open} onOpenChange={setOpen}>
			<Tooltip delayDuration={300}>
				<TooltipTrigger asChild>
					<SheetTrigger asChild>
						<Button variant={"outline"} size={"icon"}>
							<IconPlus />
						</Button>
					</SheetTrigger>
				</TooltipTrigger>
				<TooltipContent>{t("newInvoice")}</TooltipContent>
			</Tooltip>
			<SheetContent className="!max-w-2xl " showCloseButton={false}>
				<SheetHeader className="flex flex-row items-center gap-2">
					<SheetTitle className="w-full flex-1">{t("newInvoice")}</SheetTitle>
					<AddInvoiceOptions />
					<SheetCloseButton className="static" />
				</SheetHeader>
				{/* Add your invoice form content here */}
				<div className="my-3 h-[90%] overflow-x-hidden overflow-y-scroll rounded-lg bg-accent p-6">
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
								/>
							</div>
							<div className="flex flex-1 items-center gap-1">
								<h1 className="font-semibold text-muted-foreground">
									Issue Date:
								</h1>
								<DatePickerInvoice
									date={invoice.issueDate}
									setDate={invoice.setIssueDate}
								/>
							</div>
							<div className="flex flex-1 items-center gap-1">
								<h1 className="font-semibold text-muted-foreground">
									Due Date:
								</h1>
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
								/>
							</div>
							<div className="flex-1">
								<h1 className="font-semibold text-muted-foreground">To:</h1>
								<InvoiceInput
									initialValue={"Client"}
									onSave={(value) => console.log(value)}
									multiline
									rows={6}
								/>
							</div>
						</div>
					</div>
					{/* Items */}
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
									>
										{invoice.items.map((item, index) => (
											<motion.div
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
												className="group relative grid gap-2 rounded-md py-2 pr-4 font-mono text-sm hover:bg-accent/50"
												style={{
													gridTemplateColumns: "repeat(14, minmax(0, 1fr))",
												}}
											>
												<div className="col-span-5">
													<InvoiceInput
														initialValue={item.description}
														onSave={(value) =>
															invoice.updateItem(item.id, {
																...item,
																description: value,
															})
														}
													/>
												</div>
												<div className="col-span-2 flex items-center justify-center gap-2">
													<InvoiceInput
														initialValue={item.quantity.toString()}
														onSave={(value) =>
															invoice.updateItem(item.id, {
																...item,
																quantity: Number(value),
															})
														}
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
													/>
												</div>
												<div className="col-span-3 flex w-full justify-end overflow-hidden">
													<NumberFlow
														value={item.price * item.quantity}
														className="font-semibold text-sm"
														format={currencyFormat as any}
													/>
												</div>

												{index !== 0 && (
													<Button
														variant="ghost"
														size="icon"
														onClick={() => {
															invoice.removeItem(item.id);
														}}
														className="-right-5 absolute size-8 gap-2 text-foreground opacity-0 transition-all group-hover:opacity-100"
													>
														<IconMinus size={15} />
													</Button>
												)}
											</motion.div>
										))}

										{/* Add Item Button */}
										<motion.div layout className="flex justify-start pt-2">
											<Button
												variant="ghost"
												size="sm"
												onClick={() => {
													invoice.addItem({
														id: uuidv4(),
														description: "New Item",
														quantity: 0,
														price: 0,
														total: 0,
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
					{/* Totals */}
					<motion.div layout layoutId="totals" className="flex flex-row pt-4">
						<div className="flex-1" />
						<div className="flex-1 space-y-2 font-semibold">
							<motion.div layout className="flex w-full justify-between">
								<h1 className="w-full text-muted-foreground">Subtotal:</h1>
								<div className="text-right">
									<NumberFlow
										value={sum}
										className="w-full"
										format={currencyFormat}
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
														/>
														:
													</h1>
													<div className="text-right">
														<NumberFlow
															value={vat}
															className="w-full"
															format={currencyFormat}
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
										value={sum + vat}
										className="w-full"
										format={currencyFormat}
									/>
								</div>
							</motion.div>
						</div>
					</motion.div>

					{/* BANK DETAILS AND Notes */}
					<motion.div layout className="flex pt-4">
						<div className="space-y-2 flex-1">
							<h1 className="font-semibold text-muted-foreground">
								Bank Details:
							</h1>
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
							{/* Cancel */}
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
