"use client";

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
import { IconMinus, IconPlus } from "@tabler/icons-react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { useState } from "react";
import AddInvoiceOptions from "./AddInvoiceOptions";
import { DatePickerInvoice } from "./DatePickerInvoice";
import InvoiceInput from "./InvoiceInput";
import InvoicePicture from "./InvoicePicture";
import { useInvoiceOptionsStore } from "@/stores/InvoiceOptionsStore";
import NumberFlow from "@number-flow/react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import FormattedNumberInput from "./FormattedNumberInput";
import { useInvoiceValuesStore } from "@/stores/InvoiceValuesStore";
import { v4 as uuidv4 } from "uuid";
import { dropdownMenuVariants } from "@/lib/dropdownMenuVariants";

export function AddInvoice() {
	const [open, setOpen] = useState(false);

	const t = useTranslations("InvoicesPage");

	const invoiceOptions = useInvoiceOptionsStore();
	const invoiceValues = useInvoiceValuesStore();

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
				<div className="my-3 h-[90%] rounded-lg bg-accent p-6">
					<div className="flex flex-col gap-10">
						<InvoicePicture />
						<div className="flex flex-row items-center justify-between font-mono text-sm">
							<div className="flex flex-1 items-center gap-1">
								<h1 className="w-fit whitespace-nowrap font-semibold text-muted-foreground">
									Invoice No:
								</h1>
								<InvoiceInput
									initialValue={invoiceValues.values.invoiceNumber}
									onSave={invoiceValues.setInvoiceNumber}
								/>
							</div>
							<div className="flex flex-1 items-center gap-1">
								<h1 className="font-semibold text-muted-foreground">
									Issue Date:
								</h1>
								<DatePickerInvoice
									date={invoiceValues.values.issueDate}
									setDate={invoiceValues.setIssueDate}
								/>
							</div>
							<div className="flex flex-1 items-center gap-1">
								<h1 className="font-semibold text-muted-foreground">
									Due Date:
								</h1>
								<DatePickerInvoice
									date={invoiceValues.values.dueDate}
									setDate={invoiceValues.setDueDate}
									startDate={invoiceValues.values.issueDate}
								/>
							</div>
						</div>
						<div className="flex flex-row items-center justify-between gap-2 font-mono text-sm">
							<div className="flex-1">
								<h1 className="font-semibold text-muted-foreground">From:</h1>
								<InvoiceInput
									initialValue={"Kala"}
									onSave={(value) => console.log(value)}
									multiline
								/>
							</div>
							<div className="flex-1">
								<h1 className="font-semibold text-muted-foreground">To:</h1>
								<InvoiceInput
									initialValue={"Client"}
									onSave={(value) => console.log(value)}
									multiline
								/>
							</div>
						</div>
					</div>
					<div className="flex flex-col gap-4">
						{/* <h1 className="font-semibold text-muted-foreground">Items:</h1> */}
						<motion.div
							layout
							className="flex flex-col gap-2"
							transition={{ duration: 0.2 }}
						>
							{/* Add item button */}

							{/* Items list */}
							<div className="flex flex-col gap-2">
								<div
									className="grid gap-2 pr-4 font-mono font-semibold text-muted-foreground text-sm"
									style={{
										gridTemplateColumns: "repeat(14, minmax(0, 1fr))",
									}}
								>
									<div className="col-span-5">Description</div>
									<div className="col-span-2">Quantity</div>
									<div className="col-span-2">Price</div>
									{invoiceOptions.options.vat && (
										<div className="col-span-2">VAT</div>
									)}
									<div
										className={cn(
											invoiceOptions.options.vat ? "col-span-3" : "col-span-5",
											"flex justify-end",
										)}
									>
										Final
									</div>
								</div>

								<motion.div layout className="space-y-2 ">
									{/* Sample item */}

									{invoiceValues.values.items.map((item, index) => (
										<motion.div
											key={item.id}
											layoutId={item.id}
											layout
											// initial={{ opacity: 0, y: 20 }}
											// animate={{ opacity: 1, y: 0 }}
											// exit={{ opacity: 0, y: -20 }}
											variants={dropdownMenuVariants}
											initial="hidden"
											animate="visible"
											exit="exit"
											className="group relative grid gap-2 rounded-md py-2 pr-4 font-mono text-sm"
											style={{
												gridTemplateColumns: "repeat(14, minmax(0, 1fr))",
											}}
										>
											<div className="col-span-5">
												<InvoiceInput
													initialValue={item.description}
													onSave={(value) =>
														invoiceValues.updateItem(item.id, {
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
														invoiceValues.updateItem(item.id, {
															...item,
															quantity: Number(value),
														})
													}
												/>
											</div>
											<div className="col-span-2 flex justify-center">
												<FormattedNumberInput
													value={item.price}
													onChange={(value) =>
														invoiceValues.updateItem(item.id, {
															...item,
															price: value,
														})
													}
													className="w-full"
												/>
											</div>
											{invoiceOptions.options.vat && (
												<div className="col-span-2">
													<InvoiceInput
														initialValue={`${item.vat}%`}
														onSave={(value) =>
															invoiceValues.updateItem(item.id, {
																...item,
																vat: Number(value.replace("%", "")),
															})
														}
													/>
												</div>
											)}
											<div
												className={cn(
													invoiceOptions.options.vat
														? "col-span-3"
														: "col-span-5",
													"flex w-full justify-end",
												)}
											>
												<NumberFlow
													value={
														item.price * item.quantity +
														(invoiceOptions.options.vat
															? item.price *
																item.quantity *
																((item.vat ?? 0) / 100)
															: 0)
													}
													className="font-semibold text-sm"
													format={{
														currency: invoiceOptions.options.currency?.code,
														currencyDisplay: "symbol",
														style: "currency",
														roundingMode: "ceil",
														roundingIncrement: invoiceOptions.options.decimals
															? 1
															: 100,
														trailingZeroDisplay: invoiceOptions.options.decimals
															? "auto"
															: "stripIfInteger",
													}}
												/>
											</div>

											{index !== 0 && (
												<Button
													variant="ghost"
													size="sm"
													onClick={() => {
														invoiceValues.removeItem(item.id);
													}}
													className="-right-6 absolute w-fit gap-2 opacity-0 transition-opacity group-hover:opacity-100"
												>
													<IconMinus size={15} />
												</Button>
											)}
										</motion.div>
									))}

									<Button
										variant="ghost"
										size="sm"
										onClick={() => {
											invoiceValues.addItem({
												id: uuidv4(),
												description: "New Item",
												quantity: 1,
												price: 0,
												vat: 0,
												total: 0,
											});
										}}
										className="w-fit gap-2 px-0"
									>
										<IconPlus size={16} />
										Add Item
									</Button>
								</motion.div>
							</div>
						</motion.div>
					</div>
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
							console.log(invoiceValues.values);
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
