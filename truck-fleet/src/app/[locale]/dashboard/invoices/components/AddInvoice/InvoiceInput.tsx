import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

interface InvoiceInputProps {
	initialValue?: string | number;
	onSave?: (value: string) => void;
	multiline?: boolean;
	className?: string;
	trailingSymbol?: string;
}

export default function InvoiceInput({
	initialValue = "",
	onSave,
	multiline = false,
	className,
	trailingSymbol,
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
			<Textarea
				className={cn(
					"flex w-full resize-none border-0 border-transparent border-b border-none bg-transparent p-0 transition-colors placeholder:text-muted-foreground focus:border-none focus:outline-none focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-accent focus-visible:ring-opacity-50 focus-visible:ring-offset-0 focus-visible:ring-offset-transparent disabled:cursor-not-allowed disabled:opacity-50",
					className,
				)}
				autoComplete="off"
				value={value}
				rows={5}
				onInput={(e) => setValue(e.currentTarget.value)}
				onBlur={handleBlur}
			/>
		);
	}

	return (
		<div className="inline-flex items-center whitespace-nowrap">
			<Input
				className={cn(
					"h-6 min-w-0 border-0 border-transparent border-b border-none bg-transparent p-0 px-1 font-mono transition-colors file:border-0 file:bg-transparent file:font-medium file:text-sm placeholder:text-muted-foreground focus:border-none focus:outline-none focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-accent focus-visible:ring-opacity-50 focus-visible:ring-offset-0 focus-visible:ring-offset-transparent disabled:cursor-not-allowed disabled:opacity-50",
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
