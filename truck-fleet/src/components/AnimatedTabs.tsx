"use client";

import AnimatedBackground from "@/components/ui/animated-background";
import { Link, usePathname } from "@/lib/navigation";

interface AnimatedTabsProps {
	tabs: { label: string; value: string }[];
}

export default function AnimatedTabs({ tabs }: AnimatedTabsProps) {
	const pathName = usePathname();
	return (
		<div className="flex flex-row gap-2 ">
			<AnimatedBackground
				className="flex flex-row gap-2 rounded-full bg-secondary"
				transition={{
					type: "spring",
					bounce: 0.2,
					duration: 0.3,
				}}
				enableHover
			>
				{tabs.map((tab, index) => (
					<Link
						key={index}
						data-id={tab}
						type="button"
						href={tab.value}
						className={`flex flex-col items-center justify-center px-4 py-2 text-muted-foreground capitalize transition-colors duration-300 hover:text-foreground ${tab.value === pathName ? "bg-secondary/50 text-foreground" : ""} rounded-full`}
					>
						{tab.label}
					</Link>
				))}
			</AnimatedBackground>
		</div>
	);
}
