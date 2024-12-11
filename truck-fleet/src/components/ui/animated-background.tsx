"use client";
import { cn } from "@/lib/Utils";
import { AnimatePresence, type Transition, motion } from "motion/react";
import {
	Children,
	type ReactElement,
	cloneElement,
	useEffect,
	useId,
	useState,
} from "react";

type AnimatedBackgroundProps = {
	children:
		| ReactElement<{ "data-id": string }>[]
		| ReactElement<{ "data-id": string }>;
	defaultValue?: string;
	onValueChange?: (newActiveId: string | null) => void;
	className?: string;
	transition?: Transition;
	enableHover?: boolean;
};

export default function AnimatedBackground({
	children,
	defaultValue,
	onValueChange,
	className,
	transition,
	enableHover = false,
}: AnimatedBackgroundProps) {
	const [activeId, setActiveId] = useState<string | null>(null);
	const uniqueId = useId();

	const handleSetActiveId = (id: string | null) => {
		setActiveId(id);

		if (onValueChange) {
			onValueChange(id);
		}
	};

	useEffect(() => {
		if (defaultValue !== undefined) {
			setActiveId(defaultValue);
		}
	}, [defaultValue]);

	return Children.map(children, (child: any, index) => {
		const id = child.props["data-id"];

		const interactionProps = enableHover
			? {
					onMouseEnter: () => handleSetActiveId(id),
					onMouseLeave: () => handleSetActiveId(null),
				}
			: {
					onClick: () => handleSetActiveId(id),
				};

		return cloneElement(
			child,
			{
				key: index,
				className: cn("relative inline-flex", child.props.className),
				"aria-selected": activeId === id,
				"data-checked": activeId === id ? "true" : "false",
				...interactionProps,
			},
			<>
				<AnimatePresence initial={false}>
					{activeId === id && (
						<motion.div
							layoutId={`background-${uniqueId}`}
							className={cn("absolute inset-0", className)}
							transition={transition}
							initial={{ opacity: defaultValue ? 1 : 0 }}
							animate={{
								opacity: 1,
								filter: "blur(0px)",
							}}
							exit={{
								opacity: 0,
								filter: "blur(5px)",
							}}
						/>
					)}
				</AnimatePresence>
				<span className="z-10">{child.props.children}</span>
			</>,
		);
	});
}
