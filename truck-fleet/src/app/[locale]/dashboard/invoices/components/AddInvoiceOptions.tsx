import React, { useEffect, useState, useMemo, useCallback } from "react";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuPortal,
	DropdownMenuSeparator,
	DropdownMenuSub,
	DropdownMenuSubContent,
	DropdownMenuSubTrigger,
} from "@/components/ui/dropdown-menu";
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";
import {
	IconCalendar,
	IconCurrencyDollar,
	IconDotsVertical,
	IconMail,
	IconMessage,
	IconPlus,
	IconSearch,
	IconUserPlus,
} from "@tabler/icons-react";
import { code, codes } from "currency-codes-ts";
import type {
	CurrencyCode,
	CurrencyCodeRecord,
} from "currency-codes-ts/dist/types";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { InputWithIcon } from "@/components/ui/input-with-icon";
import { motion } from "framer-motion";
import {
	dropdownMenuParentVariants,
	dropdownMenuVariants,
} from "@/lib/dropdownMenuVariants";

// Add debounce utility
const debounce = (fn: Function, delay: number) => {
	let timeoutId: NodeJS.Timeout;
	return (...args: any[]) => {
		clearTimeout(timeoutId);
		timeoutId = setTimeout(() => fn(...args), delay);
	};
};

const AnimatedScrollView = motion.create(ScrollArea);

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
				}),
		[currenciesCodes],
	);

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

	const handleSearch = useCallback(
		debounce((value: string) => setSearchCurrency(value), 300),
		[],
	);

	const actions = [
		{
			label: "Date Format",
			icon: IconCalendar,
			items: ["MM/DD/YYYY", "DD/MM/YYYY", "YYYY/MM/DD"],
		},
		{
			label: "Sales Tax",
			icon: IconCalendar,
			items: ["Yes", "No"],
		},
		{
			label: "Currency",
			icon: IconCurrencyDollar,
			items: [...currencies],
		},
	];

	return (
		<DropdownMenu>
			<Tooltip>
				<TooltipTrigger asChild>
					<DropdownMenuTrigger asChild>
						<Button variant={"ghost"} size={"icon"}>
							<IconDotsVertical size={20} />
						</Button>
					</DropdownMenuTrigger>
				</TooltipTrigger>
				<TooltipContent>Options</TooltipContent>
			</Tooltip>
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
								<DropdownMenuSubTrigger className="gap-2 font-semibold text-sm">
									<action.icon size={18} />
									<span>{action.label}</span>
								</DropdownMenuSubTrigger>
								<DropdownMenuPortal>
									<DropdownMenuSubContent className="min-w-64 *:gap-2">
										{action.label.toLowerCase() === "currency" && (
											<div className="pb-2">
												<InputWithIcon
													position="leading"
													icon={<IconSearch size={18} />}
													inputProps={{
														placeholder: "Search currency",
														onInput: (e) => {
															e.stopPropagation();
															handleSearch(e.currentTarget.value);
														},
														onKeyDown: (e) => e.stopPropagation(),
													}}
												/>
											</div>
										)}

										<AnimatedScrollView
											variants={dropdownMenuParentVariants}
											initial={
												action.label.toLowerCase() === "currency"
													? "visible"
													: "hidden"
											}
											animate="visible"
											className="max-h-64 overflow-y-scroll "
										>
											<ScrollBar />
											{(action.label.toLowerCase() === "currency"
												? filteredCurrencies
												: action.items
											).map((item) => {
												if (!item) return null;

												if (
													typeof item === "object" &&
													item !== null &&
													"code" in item
												) {
													const currency = item as CurrencyCodeRecord;
													if (
														searchCurrency &&
														!currency.code
															.toLowerCase()
															.includes(searchCurrency.toLowerCase()) &&
														!currency.currency
															.toLowerCase()
															.includes(searchCurrency.toLowerCase())
													) {
														return null;
													}

													return (
														<motion.div
															variants={dropdownMenuVariants}
															key={currency.code}
														>
															<DropdownMenuItem>
																<span>
																	{currency.code} - {currency.currency}
																</span>
															</DropdownMenuItem>
														</motion.div>
													);
												}

												return (
													<motion.div
														variants={dropdownMenuVariants}
														key={item}
													>
														<DropdownMenuItem key={item}>
															<span>{item}</span>
														</DropdownMenuItem>
													</motion.div>
												);
											})}
										</AnimatedScrollView>
									</DropdownMenuSubContent>
								</DropdownMenuPortal>
							</DropdownMenuSub>
						</motion.div>
					))}
				</motion.div>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
