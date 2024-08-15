"use client";
import React, { useState } from "react";
import { Sidebar, SidebarBody, SidebarLink } from "../ui/sidebar";
import {
	IconChartPie,
	IconLogout,
	IconMap,
	IconMap2,
	IconMessage,
	IconReceiptDollar,
	IconSettings,
	IconTruck,
	IconUsersGroup,
} from "@tabler/icons-react";
import { Link } from "@/lib/navigation";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { TruckIcon } from "lucide-react";
import AnimatedBackground from "../ui/animated-background";

export default function DashboardSidebar() {
	const links = [
		{
			customLabel: true,
			label: "Truck Fleet",
			href: "#",
			icon: <TruckIcon className="h-6 w-6 flex-shrink-0" />,
		},
		{
			label: "Chat",
			href: "/dashboard/chat",
			icon: <IconMessage className="h-6 w-6 flex-shrink-0" />,
		},
		{
			label: "Dashboard",
			href: "/dashboard",
			icon: <IconChartPie className=" h-6 w-6 flex-shrink-0" />,
		},
		{
			label: "Map",
			href: "/dashboard/map",
			icon: <IconMap2 className=" h-6 w-6 flex-shrink-0" />,
		},

		{
			label: "Orders",
			href: "/dashboard/orders",
			icon: <IconReceiptDollar className=" h-6 w-6 flex-shrink-0" />,
		},
		{
			label: "Drivers",
			href: "/dashboard/drivers",
			icon: <IconUsersGroup className=" h-6 w-6 flex-shrink-0" />,
		},
		{
			label: "Trucks",
			href: "/dashboard/trucks",
			icon: <IconTruck className=" h-6 w-6 flex-shrink-0" />,
		},
	];

	const endLinks = [
		{
			label: "Kaloyan Stoyanov",
			href: "/dashboard/profile",
			customLabel: true,
			icon: (
				<Image
					src="/kala.jpg"
					className="h-6 w-6 flex-shrink-0 rounded-full object-cover bg-neutral-200 dark:bg-neutral-800"
					width={50}
					height={50}
					alt="Avatar"
				/>
			),
		},
		{
			label: "Settings",
			href: "/dashboard/settings",
			icon: <IconSettings className=" h-6 w-6 flex-shrink-0" />,
		},
		{
			label: "Sign Out",
			href: "/dashboard/sign-out",
			icon: (
				// <SigNout className="text-neutral-700 dark:text-neutral-200 h-6 w-6 flex-shrink-0" />
				<IconLogout className=" h-6 w-6 flex-shrink-0" />
			),
		},
	];

	const [open, setOpen] = useState(false);

	return (
		<Sidebar open={open} setOpen={setOpen}>
			<SidebarBody className="justify-between gap-10">
				<div className="flex flex-col flex-1  overflow-x-hidden">
					<div className="flex flex-col gap-2 ">
						{links.map((link, idx) => (
							<SidebarLink
								key={link.href}
								link={link}
								className={
									link.href === "#"
										? "cursor-default hover:bg-transparent "
										: ""
								}
							/>
						))}
					</div>
				</div>
				<div className="flex flex-col gap-2">
					{endLinks.map((link, idx) => (
						<SidebarLink key={link.href} link={link} />
					))}
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
