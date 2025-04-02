import React from "react";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { IconRight } from "react-day-picker";
import { IconArrowRight } from "@tabler/icons-react";

interface InteractiveHoverButtonProps
	extends React.ButtonHTMLAttributes<HTMLButtonElement> {
	duration?: number;
}

export const InteractiveHoverButton = React.forwardRef<
	HTMLButtonElement,
	InteractiveHoverButtonProps
>(({ duration = 300, children, className, ...props }, ref) => {
	return (
		<button
			ref={ref}
			className={cn(
				"group relative w-auto cursor-pointer overflow-hidden rounded-full border bg-background p-2 px-6 text-center font-semibold",
				className,
			)}
			{...props}
		>
			<div className="flex items-center gap-2">
				<div
					className="h-2 w-2 rounded-full bg-primary transition-all group-hover:scale-[100.8] ease-in-out-quad"
					style={{ transitionDuration: `${duration}ms` }}
				/>
				<span
					className="inline-block transition-all group-hover:translate-x-12 group-hover:opacity-0  ease-in-out-quad"
					style={{ transitionDuration: `${duration}ms` }}
				>
					{children}
				</span>
			</div>
			<div
				className="group-hover:-translate-x-5 absolute top-0 z-10 flex h-full w-full translate-x-12 items-center justify-center gap-2 text-primary-foreground opacity-0 transition-all group-hover:opacity-100 ease-in-out-quad"
				style={{ transitionDuration: `${duration}ms` }}
			>
				<span>{children}</span>
				<IconArrowRight />
			</div>
		</button>
	);
});

InteractiveHoverButton.displayName = "InteractiveHoverButton";
