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
import { motion } from "framer-motion";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "../ThemeToggle";

export default function DashboardSidebar() {
	const links = [
		{
			label: "Dashboard",
			href: "/dashboard",
			icon: (
				<IconBrandTabler className="text-neutral-700 dark:text-neutral-200 h-7 w-7 flex-shrink-0" />
			),
		},

		{
			label: "Orders",
			href: "/dashboard/orders",
			icon: (
				<IconUserBolt className="text-neutral-700 dark:text-neutral-200 h-7 w-7 flex-shrink-0" />
			),
		},
		{
			label: "Trucks",
			href: "/dashboard/trucks",
			icon: (
				<IconTruck className="text-neutral-700 dark:text-neutral-200 h-7 w-7 flex-shrink-0" />
			),
		},
	];
	const [open, setOpen] = useState(false);

	return (
		<Sidebar open={open} setOpen={setOpen}>
			<SidebarBody className="justify-between gap-10">
				<div className="flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
					{open ? <Logo /> : <LogoIcon />}
					<div className="mt-8 flex flex-col gap-2">
						{links.map((link, idx) => (
							<SidebarLink key={link.href} link={link} />
						))}
					</div>
				</div>
				<div>
					<SidebarLink
						link={{
							label: "Kaloyan Stoyanov",
							href: "/dashboard/profile",
							icon: (
								<Image
									src="/kala.jpg"
									className="h-7 w-7 flex-shrink-0 rounded-full object-cover bg-neutral-200 dark:bg-neutral-800"
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
							icon: (
								<IconSettings className="text-neutral-700 dark:text-neutral-200 h-7 w-7 flex-shrink-0" />
							),
						}}
					/>

					<SidebarLink
						link={{
							label: "Sign Out",
							href: "#",
							icon: (
								// <SigNout className="text-neutral-700 dark:text-neutral-200 h-7 w-7 flex-shrink-0" />
								<IconLogout className="text-neutral-700 dark:text-neutral-200 h-7 w-7 flex-shrink-0" />
							),
						}}
					/>
				</div>
			</SidebarBody>
		</Sidebar>
	);
}

export const Logo = () => {
	return (
		<Link
			href="#"
			className="font-normal flex space-x-2 items-center text-sm text-black py-1 relative z-20"
		>
			<div className="h-5 w-6 bg-black dark:bg-white rounded-br-lg rounded-tr-sm rounded-tl-lg rounded-bl-sm flex-shrink-0" />
			<motion.span
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				className="font-medium text-black dark:text-white whitespace-pre"
			>
				Acet Labs
			</motion.span>
		</Link>
	);
};

export const LogoIcon = () => {
	return (
		<Link
			href="#"
			className="font-normal flex space-x-2 items-center text-sm text-black py-1 relative z-20"
		>
			<div className="h-5 w-6 bg-black dark:bg-white rounded-br-lg rounded-tr-sm rounded-tl-lg rounded-bl-sm flex-shrink-0" />
		</Link>
	);
};
