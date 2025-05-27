import { VelocityScroll } from "@/components/magicui/scroll-based-velocity";

export function OptimizationText() {
	return (
		<div className="relative flex h-full w-full flex-col items-center justify-center overflow-hidden">
			<VelocityScroll
				numRows={10}
				defaultVelocity={1}
				className="font-bold text-4xl"
			>
				Organization Efficiency
			</VelocityScroll>
			<div className="pointer-events-none absolute inset-y-0 left-0 w-1/4 bg-gradient-to-r from-background" />
			<div className="pointer-events-none absolute inset-y-0 right-0 w-1/4 bg-gradient-to-l from-background" />
		</div>
	);
}
