import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useInvoiceOptionsStore } from "@/stores/Invoices/AddInvoiceOptionsStore";
import { useEffect, useState } from "react";

interface FormattedNumberInputProps {
	value?: number;
	onChange?: (value: number) => void;
	className?: string;
	decimals?: boolean;
	tabIndex?: number;
	error?: string;
}

export default function FormattedNumberInput({
	value = 0,
	onChange,
	className,
	decimals = false,
	tabIndex = 0,
	error,
}: FormattedNumberInputProps) {
	const [displayValue, setDisplayValue] = useState("");
	const invoiceOptions = useInvoiceOptionsStore();

	useEffect(() => {
		setDisplayValue(formatNumber(value.toString()));
	}, [value]);

	const formatNumber = (num: string): string => {
		if (num === "0") return "";
		const parts = num.split(".");
		parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");

		// Keep the decimal part as-is, including incomplete decimals
		return parts.join(".");
	};

	const unformatNumber = (str: string): string => {
		return str.replace(/,/g, "");
	};

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const input = e.target.value;
		const numeric = unformatNumber(input);

		// Allow numbers with optional decimal point and up to 2 decimal places
		if (numeric === "" || /^\d*\.?\d{0,2}$/.test(numeric)) {
			const formattedValue = formatNumber(numeric);
			setDisplayValue(formattedValue);

			// Convert to number, handling trailing decimal points
			const numberValue = numeric.endsWith(".")
				? Number(`${numeric}0`)
				: Number(numeric);

			onChange?.(numeric === "" ? 0 : numberValue);
		}
	};

	const onKeyDown = (e: React.KeyboardEvent) => {
		if (e.key === "Tab") {
			e.preventDefault();

			const nextTabIndex = tabIndex + 1;
			const nextElement = document.querySelector(
				`[tabindex="${nextTabIndex}"]`,
			) as HTMLElement;
			if (nextElement) {
				nextElement.focus();
			}
		}
	};

	return (
		<div className="relative">
			<Input
				type="text"
				value={displayValue}
				onChange={handleChange}
				className={cn(
					"flex h-6 w-full min-w-0 flex-shrink border-0 border-transparent border-b border-none bg-transparent p-0 px-1 font-mono transition-colors file:border-0 file:bg-transparent file:font-medium file:text-sm placeholder:text-muted-foreground focus:border-none focus:outline-none focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-accent focus-visible:ring-opacity-50 focus-visible:ring-offset-0 focus-visible:ring-offset-transparent disabled:cursor-not-allowed disabled:opacity-50",
					displayValue.length < 1 ? "!w-full bg-dot-white" : "",
					className,
					error ? "border-destructive" : "",
				)}
				inputMode="decimal"
				tabIndex={tabIndex}
				onKeyDown={onKeyDown}
			/>
			{error && (
				<span className="text-xs text-destructive w-full">{error}</span>
			)}
		</div>
	);
}
