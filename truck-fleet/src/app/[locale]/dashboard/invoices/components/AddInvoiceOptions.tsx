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

// Add debounce utility

const AnimatedScrollView = motion.create(ScrollArea);
const AnimatedInput = motion.create(Input);
const AnimatedDropdownMenuSubContent = motion.create(DropdownMenuSubContent);

export default function AddInvoiceOptions() {
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
		format(date, "dd/MM/yyyy"),
		format(date, "MM/dd/yyyy"),
		format(date, "yyyy/MM/dd"),
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

	const [checkedDateFormat, setCheckedDateFormat] = useState(dateFormats[0]);
	const [checkedCurrency, setCheckedCurrency] = useState(filteredCurrencies[0]);

	const [salesTax, setSalesTax] = useState(false);
	const [vat, setVat] = useState(false);
	const [vatNumbers, setVatNumbers] = useState(false);
	const [discount, setDiscount] = useState(false);
	const [decimals, setDecimals] = useState(false);

	const actions = [
		{
			label: "Sales Tax",
			icon: IconCalendar,
			items: ["yes", "no"],
			value: salesTax,
			setValue: setSalesTax,
		},
		{
			label: "VAT",
			icon: IconCalculator,
			items: ["yes", "no"],
			value: vat,
			setValue: setVat,
		},
		{
			label: "VAT Numbers",
			icon: IconNumber,
			items: ["yes", "no"],
			value: vatNumbers,
			setValue: setVatNumbers,
		},
		{
			label: "Discount",
			icon: IconDiscount2,
			items: ["yes", "no"],
			value: discount,
			setValue: setDiscount,
		},
		{
			label: "Decimals",
			icon: IconDecimal,
			items: ["yes", "no"],
			value: decimals,
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
												setCheckedDateFormat(item);
											}}
											onCheckedChange={(checked) => {
												if (checked) {
													setCheckedDateFormat(item);
												}
											}}
											checked={checkedDateFormat === item}
										>
											{item as string}
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
													setCheckedCurrency(currency);
												}}
												checked={checkedCurrency?.code === currency?.code}
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
