"use client";
import React, { useState } from "react";
import { Sidebar, SidebarBody, SidebarLink } from "../ui/sidebar";
import {
	IconArrowLeft,
	IconBrandTabler,
	IconLogout,
	IconSettings,
	IconSignLeft,
	IconTruck,
	IconUserBolt,
} from "@tabler/icons-react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "../theme-toggle";
import { TruckIcon } from "lucide-react";
import AnimatedBackground from "../ui/animated-background";

export default function DashboardSidebar() {
	const links = [
		{
			label: "Dashboard",
			href: "/dashboard",
			icon: <IconBrandTabler className=" h-6 w-6 flex-shrink-0" />,
		},

		{
			label: "Orders",
			href: "/dashboard/orders",
			icon: <IconUserBolt className=" h-6 w-6 flex-shrink-0" />,
		},
		{
			label: "Trucks",
			href: "/dashboard/trucks",
			icon: <IconTruck className=" h-6 w-6 flex-shrink-0" />,
		},
	];
	const [open, setOpen] = useState(false);

	return (
		<Sidebar open={open} setOpen={setOpen}>
			<SidebarBody className="justify-between gap-10">
				<div className="flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
					{/* {open ? <Logo /> : <TruckIcon />} */}
					{/* <Logo open={open} /> */}
					<SidebarLink
						className="cursor-default hover:scale-100 "
						link={{
							label: "Truck Fleet",
							href: "#",
							icon: <TruckIcon className="h-6 w-6 flex-shrink-0" />,
						}}
					/>
					<div className="mt-8 flex flex-col gap-2">
						<AnimatedBackground
							className="rounded-lg bg-zinc-100 dark:bg-zinc-800"
							transition={{
								type: "spring",
								bounce: 0.2,
								duration: 0.3,
							}}
							enableHover
						>
							{links.map((link, idx) => (
								<SidebarLink data-id={link.href} key={link.href} link={link} />
							))}
						</AnimatedBackground>
					</div>
				</div>
				<div className="flex flex-col gap-2">
					<SidebarLink
						link={{
							label: "Kaloyan Stoyanov",
							href: "/dashboard/profile",
							icon: (
								<Image
									src="/kala.jpg"
									className="h-6 w-6 flex-shrink-0 rounded-full object-cover bg-neutral-200 dark:bg-neutral-800"
									width={50}
									height={50}
									alt="Avatar"
								/>
							),
						}}
					/>
					<SidebarLink
						link={{
							label: "Settings",
							href: "/dashboard/settings",
							icon: <IconSettings className=" h-6 w-6 flex-shrink-0" />,
						}}
					/>

					<SidebarLink
						link={{
							label: "Sign Out",
							href: "#",
							icon: (
								// <SigNout className="text-neutral-700 dark:text-neutral-200 h-6 w-6 flex-shrink-0" />
								<IconLogout className=" h-6 w-6 flex-shrink-0" />
							),
						}}
					/>
				</div>
			</SidebarBody>
		</Sidebar>
	);
}

export function Logo({ open }: { open: boolean }) {
	return (
		<Link
			href="#"
			className="font-normal flex space-x-2 items-center text-sm text-white py-1 relative z-20"
		>
			<TruckIcon />

			<AnimatePresence>
				{open ? (
					<motion.span
						initial={{ opacity: 0, scale: 0 }}
						animate={{ opacity: 1, scale: 1 }}
						exit={{ opacity: 0, scale: 0 }}
						className="font-medium text-black dark:text-white whitespace-pre"
					>
						Truck Fleet
					</motion.span>
				) : (
					<></>
				)}
			</AnimatePresence>
		</Link>
	);
}

export const LogoIcon = () => {
	return (
		<Link
			href="#"
			className="font-normal flex space-x-2 items-center text-sm text-black py-1 relative z-20"
		>
			<TruckIcon />
		</Link>
	);
};
