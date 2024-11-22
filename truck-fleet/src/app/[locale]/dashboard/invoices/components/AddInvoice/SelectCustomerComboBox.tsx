import { Button } from "@/components/ui/button";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import useMediaQuery from "@/hooks/useMediaQuery";

import React, { useState } from "react";
import DriverList from "../../../drivers/components/DriverList";
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from "@/components/ui/command";
import { motion } from "framer-motion";
import { Combo } from "next/font/google";
import { useInvoiceValuesStore } from "@/stores/Invoices/InvoiceValuesStore";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";

interface InvoiceInputProps {
	tabIndex?: number;
}

export default function SelectCustomerComboBox({
	tabIndex = 0,
}: InvoiceInputProps) {
	const isDesktop = useMediaQuery("(min-width: 768px)");
	const [open, setOpen] = useState(false);

	const triggerButton = (
		<Button
			className="-top-2 -left-4 absolute z-100"
			variant={"linkHover2"}
			// size={"sm"}
			onClick={() => console.log("customer")}
			tabIndex={tabIndex}
			onKeyDown={(e) => {
				if (e.key === "Enter" || e.key === "Tab") {
					e.preventDefault();
					const nextElement = document.querySelector(
						`[tabindex="${tabIndex + 1}"]`,
					) as HTMLElement;
					nextElement?.focus();
				}
			}}
		>
			Select Customer
		</Button>
	);

	const list = <ComboBox setOpen={setOpen} />;

	if (isDesktop) {
		return (
			<>
				<Popover open={open} onOpenChange={setOpen}>
					<PopoverTrigger asChild>{triggerButton}</PopoverTrigger>
					<PopoverContent className="w-full p-0" align="start">
						{list}
					</PopoverContent>
				</Popover>
			</>
		);
	}

	return (
		<Drawer open={open} onOpenChange={setOpen}>
			<DrawerTrigger asChild>{triggerButton}</DrawerTrigger>
			<DrawerContent>
				<div className="mt-4 border-t">{list}</div>
			</DrawerContent>
		</Drawer>
	);
}

function ComboBox({ setOpen }: { setOpen: (open: boolean) => void }) {
	const { customers, setSelectedCustomer } = useInvoiceValuesStore();

	return (
		<Command>
			<CommandInput />
			<CommandList className="w-[--radix-popper-anchor-width]">
				<CommandEmpty>
					<motion.div
						initial={{ opacity: 0, scale: 0.7, y: -10 }}
						animate={{ opacity: 1, scale: 1, y: 0 }}
						transition={{ duration: 0.6, type: "spring", bounce: 0.5 }}
						className="gap-4 flex flex-col px-6 w-full"
					>
						{/* <h1>{t("noResultsFound")}</h1>
						<Button>{addText}</Button> */}
						<Button>Create new customer</Button>
					</motion.div>
				</CommandEmpty>
				<CommandGroup>
					{/* {values?.docs.map((driver) => {
						const driverData = driver.data();
						return (
							<CommandItem
								key={driver.id}
								value={driverData.name}
								onSelect={(value) => {
									setRef(driver?.ref ?? null);
									setSelectedValue(value);
									setOpen(false);
								}}
							>
								{driverData[field]}
							</CommandItem>
						);
					})} */}
					{customers.map((customer) => (
						<CommandItem
							key={customer.id}
							value={customer.name}
							onSelect={() => {
								setSelectedCustomer(customer);
								setOpen(false);
							}}
							className="w-full"
						>
							{customer.name}
						</CommandItem>
					))}
				</CommandGroup>
			</CommandList>
		</Command>
	);
}
