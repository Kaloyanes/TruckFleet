"use client";
import { cn } from "@/lib/utils";
import Link, { type LinkProps } from "next/link";
import type React from "react";
import { useState, createContext, useContext, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { IconMenu2, IconX } from "@tabler/icons-react";
import { usePathname } from "next/navigation";
import { Button } from "./button";

interface Links {
	label: string;
	href: string;
	icon: React.JSX.Element | React.ReactNode;
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
					"h-full px-2 py-4 hidden  md:flex md:flex-col bg-background border-r border-border w-[200px] flex-shrink-0",
					className,
				)}
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
					"h-20 px-4 py-4 flex flex-row md:hidden  items-center justify-between bg-background border-b border-border w-full",
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
								duration: 0.6,
								type: "spring",
								bounce: 0.1,
							}}
							className={cn(
								"fixed h-full w-full inset-0 bg-background p-10 z-[100] flex flex-col justify-between",
								className,
							)}
						>
							<Button
								size="icon"
								variant={"ghost"}
								className="absolute right-10 top-10 z-50 "
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
	return (
		<Link
			href={isActive ? "#" : link.href}
			className={cn(
				"flex items-center justify-start gap-2 group/sidebar py-2 hover:text-neutral-700 dark:hover:text-neutral-300 hover:scale-[1.02] bg-transparent  rounded-lg px-2.5 mx-1 transition-all duration-300 ease-out",
				className,
				isActive ? "bg-accent" : "",
			)}
			{...props}
		>
			{link.icon}
			<motion.span
				animate={{
					display: animate ? (open ? "inline-block" : "none") : "inline-block",
					opacity: animate ? (open ? 1 : 0) : 1,
					scale: animate ? (open ? 1 : 0.3) : 1,
					x: animate ? (open ? 0 : -40) : 0,
				}}
				transition={{ duration: 0.3, type: "spring", bounce: 0.2 }}
				className=" text-sm group-hover/sidebar:translate-x-1 transition ease-out duration-300 whitespace-pre inline-block !p-0 !m-0  "
			>
				{link.label}
			</motion.span>
		</Link>
	);
};
