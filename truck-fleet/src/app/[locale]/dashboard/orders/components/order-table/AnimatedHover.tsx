import {
	HoverCard,
	HoverCardContent,
	HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Separator } from "@/components/ui/separator";
import {
	dropdownMenuParentVariants,
	dropdownMenuVariants,
} from "@/lib/DropdownMenuVariants";
import type { Icon, IconProps } from "@tabler/icons-react";
import { motion } from "motion/react";
import { useTranslations } from "next-intl";
import type { ForwardRefExoticComponent, RefAttributes } from "react";

export default function AnimatedHover({
	actions,
	children,
}: {
	actions: {
		type: "separator" | "info" | "label";
		label?: string;
		icon?:
			| ForwardRefExoticComponent<IconProps & RefAttributes<Icon>>
			| undefined;
		onClick?: () => void;
		value?: string;
	}[];
	children: React.ReactNode;
}) {
	const t = useTranslations();

	return (
		<HoverCard openDelay={150} closeDelay={150}>
			<HoverCardTrigger>{children}</HoverCardTrigger>
			<HoverCardContent sideOffset={10} className="w-[25vw] p-6">
				<motion.div
					variants={dropdownMenuParentVariants}
					initial="hidden"
					animate="visible"
					className="flex flex-col gap-3"
				>
					{actions.map((action, index) => (
						<motion.div
							variants={dropdownMenuVariants}
							key={index}
							className="flex items-center gap-2 rounded-md"
							onClick={action.onClick}
							onKeyUp={action.onClick}
						>
							{action.type === "label" && (
								<>
									{action.icon && <action.icon />}
									<span>{t(action.label as any)}</span>
								</>
							)}

							{action.type === "separator" && (
								<Separator className="-mx-6 my-1 h-px w-[50vw] bg-muted" />
							)}

							{action.type === "info" && (
								<>
									{action.icon && <action.icon />}
									<span>
										{t(action.label as any)}: {action.value}
									</span>
								</>
							)}
						</motion.div>
					))}
				</motion.div>
			</HoverCardContent>
		</HoverCard>
	);
}
