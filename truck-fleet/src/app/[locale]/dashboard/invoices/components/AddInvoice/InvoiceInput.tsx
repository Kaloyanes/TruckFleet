import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

interface InvoiceInputProps {
	initialValue?: string | number;
	onSave?: (value: string) => void;
	multiline?: boolean;
	rows?: number;
	className?: string;
	trailingSymbol?: string;
	customerButton?: boolean;
}

export default function InvoiceInput({
	initialValue = "",
	onSave,
	multiline = false,
	rows = 5,
	className,
	trailingSymbol,
	customerButton = false,
}: InvoiceInputProps) {
	const [value, setValue] = useState(
		String(initialValue).replace(trailingSymbol ?? "", ""),
	);

	// biome-ignore lint/correctness/useExhaustiveDependencies: <It creates a recursion>
	useEffect(() => {
		onSave?.(value + (trailingSymbol ?? ""));
	}, [value]);

	const handleBlur = () => {
		onSave?.(value + (trailingSymbol ?? ""));
	};

	if (multiline) {
		return (
			<div className="relative">
				<Textarea
					className={cn(
						"relative flex w-full resize-none border-0 border-transparent border-b border-none bg-transparent p-0 transition-colors placeholder:text-muted-foreground focus:border-none focus:outline-none focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-accent focus-visible:ring-opacity-50 focus-visible:ring-offset-0 focus-visible:ring-offset-transparent disabled:cursor-not-allowed disabled:opacity-50",
						value.length < 1 && !customerButton ? "!w-full bg-dot-white" : "",
						className,
					)}
					autoComplete="off"
					value={value}
					rows={rows}
					onInput={(e) => setValue(e.currentTarget.value)}
					onBlur={handleBlur}
				/>
				{customerButton && value.length < 1 && (
					<Button
						className="absolute -top-2 -left-4 z-100"
						variant={"linkHover2"}
						// size={"sm"}
						onClick={() => console.log("customer")}
					>
						Select Customer
					</Button>
				)}
			</div>
		);
	}

	return (
		<div className="inline-flex items-center whitespace-nowrap">
			<Input
				className={cn(
					"h-6 min-w-0 border-0 border-transparent border-b border-none bg-transparent p-0 px-1 font-mono transition-colors file:border-0 file:bg-transparent file:font-medium file:text-sm placeholder:text-muted-foreground focus:border-none focus:outline-none focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-accent focus-visible:ring-opacity-50 focus-visible:ring-offset-0 focus-visible:ring-offset-transparent disabled:cursor-not-allowed disabled:opacity-50",
					value.length < 1 ? "bg-dot-white !w-full" : "",
					className,
				)}
				style={{ width: `${value.length + 1}ch` }}
				autoComplete="off"
				value={value}
				onInput={(e) => setValue(e.currentTarget.value)}
				onBlur={handleBlur}
			/>
			{trailingSymbol && (
				<span className="text-muted-foreground">{trailingSymbol}</span>
			)}
		</div>
	);
}
