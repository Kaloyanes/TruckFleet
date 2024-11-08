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
import { dropdownMenuParentVariants } from "@/lib/dropdownMenuVariants";
import { DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";
import {
	IconCalculator,
	IconCalendar,
	IconCurrency,
	IconDotsVertical,
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

	const actions = [
		{
			label: "Sales Tax",
			icon: IconCalendar,
			items: ["Yes", "No"],
		},
		{
			label: "VAT",
			icon: IconCalculator,
			items: ["Yes", "No"],
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
					{/* Date Formats */}
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

					{/* Currency */}
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
								<ScrollArea className="max-h-48 overflow-y-auto">
									{filteredCurrencies.map((currency) => (
										<DropdownMenuCheckboxItem
											key={currency?.code}
											onClick={(e) => {
												e.preventDefault();
												setCheckedCurrency(currency);

												setSearchCurrency("");
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
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
