import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuCheckboxItem,
	DropdownMenuContent,
	DropdownMenuPortal,
	DropdownMenuSub,
	DropdownMenuSubContent,
	DropdownMenuSubTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import {
	dropdownMenuParentVariants,
	dropdownMenuVariants,
} from "@/lib/dropdownMenuVariants";
import { useInvoiceOptionsStore } from "@/stores/Invoices/InvoiceOptionsStore";
import { DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";
import {
	IconCalculator,
	IconCalendar,
	IconCurrency,
	IconDecimal,
	IconDiscount2,
	IconDotsVertical,
	IconNumber,
} from "@tabler/icons-react";
import { code, codes } from "currency-codes-ts";
import type { CurrencyCode } from "currency-codes-ts/dist/types";
import { format } from "date-fns";
import { motion } from "framer-motion";
import { useMemo, useState } from "react";

const AnimatedScrollView = motion.create(ScrollArea);
const AnimatedInput = motion.create(Input);
const AnimatedDropdownMenuSubContent = motion.create(DropdownMenuSubContent);

export default function AddInvoiceOptions() {
	const {
		options,
		setDateFormat,
		setCurrency,
		setSalesTax,
		setVat,
		setVatNumbers,
		setDiscount,
		setDecimals,
	} = useInvoiceOptionsStore();

	const currenciesCodes = codes();

	const currencies = useMemo(
		() =>
			currenciesCodes
				.map((currency: CurrencyCode) => {
					const currencyInfo = code(currency);
					if (!currencyInfo || currencyInfo.code.at(0) === "X") return null;
					return currencyInfo;
				})
				.sort((a, b) => {
					if (!a || !b) return 0;
					if (a.countries.length > b.countries.length) return -1;
					if (a.countries.length < b.countries.length) return 1;
					if (a.code > b.code) return 1;
					if (a.code < b.code) return -1;
					return 0;
				}),
		[currenciesCodes],
	);

	const date = new Date();
	const dateFormats = [
		{
			label: format(date, "dd/MM/yyyy"),
			value: "dd/MM/yyyy",
		},

		// format(date, "MM/dd/yyyy"),
		{
			label: format(date, "MM/dd/yyyy"),
			value: "MM/dd/yyyy",
		},
		// format(date, "yyyy/MM/dd"),
		{
			label: format(date, "yyyy/MM/dd"),
			value: "yyyy/MM/dd",
		},
	];

	const [searchCurrency, setSearchCurrency] = useState("");

	const filteredCurrencies = useMemo(
		() =>
			!searchCurrency
				? currencies
				: currencies.filter(
						(currency) =>
							currency &&
							(currency.code
								.toLowerCase()
								.includes(searchCurrency.toLowerCase()) ||
								currency.currency
									.toLowerCase()
									.includes(searchCurrency.toLowerCase())),
					),
		[currencies, searchCurrency],
	);

	const actions = [
		{
			label: "Sales Tax",
			icon: IconCalendar,
			items: ["yes", "no"],
			value: options.salesTax,
			setValue: setSalesTax,
		},
		{
			label: "VAT",
			icon: IconCalculator,
			items: ["yes", "no"],
			value: options.vat,
			setValue: setVat,
		},
		{
			label: "VAT Numbers",
			icon: IconNumber,
			items: ["yes", "no"],
			value: options.vatNumbers,
			setValue: setVatNumbers,
		},
		{
			label: "Discount",
			icon: IconDiscount2,
			items: ["yes", "no"],
			value: options.discount,
			setValue: setDiscount,
		},
		{
			label: "Decimals",
			icon: IconDecimal,
			items: ["yes", "no"],
			value: options.decimals,
			setValue: setDecimals,
		},
	];

	return (
		<DropdownMenu>
			<TooltipProvider key={"optionsTooltip"}>
				<Tooltip defaultOpen={false}>
					<DropdownMenuTrigger asChild>
						<TooltipTrigger asChild>
							<Button variant={"ghost"} size={"icon"}>
								<IconDotsVertical size={20} />
							</Button>
						</TooltipTrigger>
					</DropdownMenuTrigger>
					<TooltipContent>Options</TooltipContent>
				</Tooltip>
			</TooltipProvider>
			<DropdownMenuContent className="*:gap-2 *:font-semibold *:text-sm">
				<motion.div
					className=""
					variants={dropdownMenuParentVariants}
					initial="hidden"
					animate="visible"
				>
					{actions.map((action) => (
						<motion.div key={action.label} variants={dropdownMenuVariants}>
							<DropdownMenuSub key={action.label}>
								<DropdownMenuSubTrigger className="gap-2">
									<action.icon size={18} />
									<span>{action.label}</span>
								</DropdownMenuSubTrigger>
								<DropdownMenuPortal>
									<AnimatedDropdownMenuSubContent className="min-w-64 *:gap-2">
										{action.items.map((item) => (
											<DropdownMenuCheckboxItem
												onClick={(e) => {
													e.preventDefault();
													action.setValue(item === "yes");
												}}
												checked={item === "yes" ? action.value : !action.value}
												key={item}
												className="capitalize"
											>
												{item}
											</DropdownMenuCheckboxItem>
										))}
									</AnimatedDropdownMenuSubContent>
								</DropdownMenuPortal>
							</DropdownMenuSub>
						</motion.div>
					))}
					{/* Date Formats */}
					<motion.div variants={dropdownMenuVariants}>
						<DropdownMenuSub>
							<DropdownMenuSubTrigger className="gap-2 font-semibold text-sm">
								<IconCalendar size={18} />
								<span>Date Format</span>
							</DropdownMenuSubTrigger>
							<DropdownMenuPortal>
								<DropdownMenuSubContent className="min-w-64 *:gap-2">
									{dateFormats.map((item) => (
										<DropdownMenuCheckboxItem
											key={item?.toString()}
											onClick={(e) => {
												e.preventDefault();
												setDateFormat(item.value);
											}}
											onCheckedChange={(checked) => {
												if (checked) {
													setDateFormat(item.value);
												}
											}}
											checked={options.dateFormat === item.value}
										>
											{item.label}
										</DropdownMenuCheckboxItem>
									))}
								</DropdownMenuSubContent>
							</DropdownMenuPortal>
						</DropdownMenuSub>
					</motion.div>
					{/* Currency */}
					<motion.div variants={dropdownMenuVariants}>
						<DropdownMenuSub>
							<DropdownMenuSubTrigger className="gap-2 font-semibold text-sm">
								<IconCurrency size={18} />
								<span>Currency</span>
							</DropdownMenuSubTrigger>
							<DropdownMenuPortal>
								<DropdownMenuSubContent className="min-w-64 *:gap-2">
									<Input
										type="text"
										placeholder="Search currency"
										className="w-full border-none"
										value={searchCurrency}
										onKeyDown={(e) => e.stopPropagation()}
										onChange={(e) => setSearchCurrency(e.target.value)}
									/>
									<ScrollArea className="max-h-80 overflow-y-auto">
										{filteredCurrencies.map((currency) => (
											<DropdownMenuCheckboxItem
												key={currency?.code}
												onClick={(e) => {
													e.preventDefault();
													if (currency !== null) setCurrency(currency);
												}}
												checked={options.currency.code === currency?.code}
											>
												{currency?.currency} ({currency?.code})
											</DropdownMenuCheckboxItem>
										))}
									</ScrollArea>
								</DropdownMenuSubContent>
							</DropdownMenuPortal>
						</DropdownMenuSub>
					</motion.div>
				</motion.div>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
