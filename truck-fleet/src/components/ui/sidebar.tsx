"use client";
import { Link } from "@/lib/navigation";
import { cn } from "@/lib/utils";
import { IconMenu2, IconX } from "@tabler/icons-react";
import { AnimatePresence, motion } from "framer-motion";
import { useTranslations } from "next-intl";
import type { LinkProps } from "next/link";
import { usePathname } from "next/navigation";
import type React from "react";
import { createContext, useContext, useState } from "react";
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "./accordion";
import { Button } from "./button";

interface Links {
	label: string;
	href: string;
	icon: React.JSX.Element | React.ReactNode;
	customLabel?: boolean;
}

interface SidebarContextProps {
	open: boolean;
	setOpen: React.Dispatch<React.SetStateAction<boolean>>;
	animate: boolean;
}

const SidebarContext = createContext<SidebarContextProps | undefined>(
	undefined,
);

export const useSidebar = () => {
	const context = useContext(SidebarContext);
	if (!context) {
		throw new Error("useSidebar must be used within a SidebarProvider");
	}
	return context;
};

export const SidebarProvider = ({
	children,
	open: openProp,
	setOpen: setOpenProp,
	animate = true,
}: {
	children: React.ReactNode;
	open?: boolean;
	setOpen?: React.Dispatch<React.SetStateAction<boolean>>;
	animate?: boolean;
}) => {
	const [openState, setOpenState] = useState(false);

	const open = openProp !== undefined ? openProp : openState;
	const setOpen = setOpenProp !== undefined ? setOpenProp : setOpenState;

	return (
		<SidebarContext.Provider value={{ open, setOpen, animate: animate }}>
			{children}
		</SidebarContext.Provider>
	);
};

export const Sidebar = ({
	children,
	open,
	setOpen,
	animate,
}: {
	children: React.ReactNode;
	open?: boolean;
	setOpen?: React.Dispatch<React.SetStateAction<boolean>>;
	animate?: boolean;
}) => {
	return (
		<SidebarProvider open={open} setOpen={setOpen} animate={animate}>
			{children}
		</SidebarProvider>
	);
};

export const SidebarBody = (props: React.ComponentProps<typeof motion.div>) => {
	return (
		<>
			<DesktopSidebar {...props} />
			<MobileSidebar {...(props as React.ComponentProps<"div">)} />
		</>
	);
};

export const DesktopSidebar = ({
	className,
	children,
	...props
}: React.ComponentProps<typeof motion.div>) => {
	const { open, setOpen, animate } = useSidebar();
	return (
		<>
			<motion.div
				className={cn(
					"h-full px-2 py-4 hidden  md:flex md:flex-col bg-background w-[200px] flex-shrink-0",
					className,
				)}
				initial={{ width: "70px" }}
				animate={{
					width: animate ? (open ? "200px" : "70px") : "200px",
				}}
				onMouseEnter={() => setOpen(true)}
				onMouseLeave={() => setOpen(false)}
				{...props}
			>
				{children}
			</motion.div>
		</>
	);
};

export const MobileSidebar = ({
	className,
	children,
	...props
}: React.ComponentProps<"div">) => {
	const { open, setOpen } = useSidebar();
	return (
		<>
			<div
				className={cn(
					"flex h-20 w-full flex-row items-center justify-between border-border border-b bg-background px-4 py-4 md:hidden",
				)}
				{...props}
			>
				<div className="flex justify-end z-20 w-full">
					<Button onClick={() => setOpen(!open)} variant={"ghost"}>
						<IconMenu2 className="" />
					</Button>
				</div>
				<AnimatePresence>
					{open && (
						<motion.div
							initial={{ x: "-100%", opacity: 0.8 }}
							animate={{ x: 0, opacity: 1 }}
							exit={{ x: "-100%", opacity: 0.8 }}
							transition={{
								duration: 0.7,
								type: "spring",
								bounce: 0.2,
							}}
							className={cn(
								"fixed inset-0 z-[100] flex h-full w-full flex-col justify-between bg-background p-10",
								className,
							)}
						>
							<Button
								size="icon"
								variant={"ghost"}
								className="absolute top-10 right-10 z-50 "
								onKeyUp={() => setOpen(!open)}
								onClick={() => setOpen(!open)}
							>
								<IconX />
							</Button>
							{children}
						</motion.div>
					)}
				</AnimatePresence>
			</div>
		</>
	);
};

export const SidebarLink = ({
	link,
	className,
	...props
}: {
	link: Links;
	className?: string;
	props?: LinkProps;
}) => {
	const { open, animate } = useSidebar();
	const pathName = usePathname();
	const isActive =
		(pathName.includes(link.href) && link.href !== "/dashboard") ||
		pathName === link.href;
	const t = useTranslations("SidebarLink");
	return (
		<Link
			href={isActive ? "#" : link.href}
			className={cn(
				"group/sidebar mx-1 flex items-center justify-start gap-2 rounded-lg bg-transparent px-2.5 py-2 transition-all duration-600 ease-out hover:scale-[1.02] hover:text-neutral-700 dark:hover:text-neutral-300",
				className,
				isActive ? "bg-accent" : "hover:bg-accent/50",
			)}
			{...props}
		>
			{link.icon}
			<motion.span
				initial={{ display: "none", opacity: 0, scale: 0.3, x: -40 }}
				animate={{
					display: animate ? (open ? "inline-block" : "none") : "inline-block",
					opacity: animate ? (open ? 1 : 0) : 1,
					scale: animate ? (open ? 1 : 0.4) : 1,
					x: animate ? (open ? 0 : -30) : 0,
				}}
				transition={{ duration: 0.3, type: "spring", bounce: 0.2 }}
				className=" !p-0 !m-0 inline-block whitespace-pre text-sm transition duration-300 ease-out group-hover/sidebar:translate-x-1 "
			>
				{link.customLabel ? link.label : t(link.label.toLowerCase() as any)}
			</motion.span>
		</Link>
	);
};

export const SidebarCategory = ({
	category,
	children,
	icon,
	className,
	...props
}: {
	category: string;
	icon: React.ReactNode;
	children: React.ReactNode;
	className?: string;
} & React.ComponentProps<"div">) => {
	const { open, animate } = useSidebar();
	const pathName = usePathname();

	const t = useTranslations("SidebarLink");

	return (
		<Accordion type="single" collapsible className="w-full">
			<AccordionItem
				value="item-1"
				className="border-b-0 flex flex-col items-center justify-start gap-2 group/sidebar py-2 hover:text-neutral-700 dark:hover:text-neutral-300 hover:scale-[1.02] bg-transparent  rounded-lg px-2.5 mx-1 transition-all duration-600 ease-out"
			>
				<AccordionTrigger>
					{icon}

					<motion.span
						initial={{ display: "none", opacity: 0, scale: 0.3, x: -40 }}
						animate={{
							display: animate
								? open
									? "inline-block"
									: "none"
								: "inline-block",
							opacity: animate ? (open ? 1 : 0) : 1,
							scale: animate ? (open ? 1 : 0.2) : 1,
							x: animate ? (open ? 0 : -50) : 0,
						}}
						transition={{ duration: 0.3, type: "spring", bounce: 0.3 }}
						className=" text-sm group-hover/sidebar:translate-x-1 transition ease-out duration-300 whitespace-pre inline-block !p-0 !m-0  "
					>
						{category}
					</motion.span>
				</AccordionTrigger>
				<AccordionContent>{children}</AccordionContent>
			</AccordionItem>
		</Accordion>
	);
};
