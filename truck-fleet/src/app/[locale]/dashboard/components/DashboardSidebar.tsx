"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarGroup,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarMenuSub,
	SidebarMenuSubButton,
	SidebarMenuSubItem,
	SidebarRail,
	useSidebar,
} from "@/components/ui/sidebar";
import useProfileDoc from "@/hooks/useProfileDoc";
import {
	dropdownMenuParentVariants,
	dropdownMenuVariants,
} from "@/lib/dropdownMenuVariants";
import { Link, usePathname } from "@/lib/navigation";
import { cn } from "@/lib/utils";
import {
	IconBell,
	IconChartPie,
	IconChevronRight,
	IconChevronUp,
	IconFileText,
	IconLayoutSidebar,
	IconLogout,
	IconMap2,
	IconMessage,
	IconPackages,
	IconReceiptDollar,
	IconSettings,
	IconTruck,
	IconUser,
	IconUsersGroup,
} from "@tabler/icons-react";
import { AnimatePresence, motion } from "framer-motion";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { useState } from "react";

const AnimatedSidebarMenuItem = motion.create(SidebarMenuItem);
const AnimatedSidebarMenuButton = motion.create(SidebarMenuButton);
const AnimatedCollapsible = motion.create(Collapsible);
const AnimatedCollapsibleTrigger = motion.create(CollapsibleTrigger);

export default function DashboardSidebar() {
	const { profile } = useProfileDoc();

	const pathName = usePathname();

	const navMain = [
		{
			title: "chat",
			url: "/dashboard/chat",
			icon: IconMessage,
		},
		{
			title: "dashboard",
			url: "/dashboard",
			icon: IconChartPie,
		},

		{
			title: "Fleet Managment",
			icon: IconTruck,
			type: "group",
			items: [
				{
					title: "orders",
					url: "/dashboard/orders",
					icon: IconReceiptDollar,
				},
				{
					title: "drivers",
					url: "/dashboard/drivers",
					icon: IconUsersGroup,
				},
				{
					title: "trucks",
					url: "/dashboard/trucks",
					icon: IconTruck,
				},
			],
		},
		{
			title: "map",
			url: "/dashboard/map",
			icon: IconMap2,
		},
		{
			title: "invoices",
			url: "/dashboard/invoices",
			icon: IconFileText,
		},
	];

	const profileSettings = [
		{
			title: "account",
			url: "/dashboard/account",
			icon: IconUser,
		},
		{
			title: "settings",
			url: "/dashboard/settings",
			icon: IconSettings,
		},
		{
			danger: true,
			title: "sign out",
			url: "/dashboard/sign-out",
			icon: IconLogout,
		},
	];

	const { toggleSidebar, open } = useSidebar();

	const profileSettingsIsActive = profileSettings.some((item) =>
		pathName.includes(item.url),
	);

	const t = useTranslations("SidebarLink");

	return (
		<Sidebar collapsible="icon">
			<SidebarHeader className="gap-2 ">
				<SidebarMenuButton size={"lg"} tooltip={"Truck Fleet"}>
					<div className="flex aspect-square size-8 items-center justify-center rounded-lg">
						<IconPackages className="size-6" />
					</div>
					<div className="grid flex-1 text-left text-lg leading-tight">
						<span className="truncate font-semibold">Truck Fleet</span>
					</div>
				</SidebarMenuButton>
				<SidebarMenuButton
					size={"lg"}
					className=""
					tooltip={"Notifications"}
					asChild
				>
					<Link href="/dashboard/notifications" className="flex gap-2">
						<div className="flex aspect-square size-8 items-center justify-center rounded-lg">
							<IconBell className="size-6" />
						</div>
						<div className="grid flex-1 text-left leading-tight">
							<span className="truncate">Notifications</span>
						</div>
					</Link>
				</SidebarMenuButton>
			</SidebarHeader>
			<SidebarContent>
				<SidebarGroup>
					<SidebarMenu className="space-y-1">
						{navMain.map((item) => {
							if (item.type === "group") {
								const isGroupActive = item?.items?.some((item) =>
									pathName.includes(item.url),
								);
								const [isActive, setActive] = useState(isGroupActive);

								return (
									<AnimatedCollapsible
										layout
										key={item.title}
										asChild
										className="group/collapsible"
										defaultOpen={isActive}
										onOpenChange={(isOpen) => setActive(isOpen)}
									>
										<AnimatedSidebarMenuItem layout>
											<AnimatedCollapsibleTrigger asChild>
												<AnimatedSidebarMenuButton
													layout
													size={"lg"}
													tooltip={t(item.title as any)}
													isActive={isGroupActive}
													className="z-50"
												>
													<motion.div
														layout
														className="flex aspect-square size-8 items-center justify-center rounded-lg"
													>
														{item.icon && <item.icon className="size-6" />}
													</motion.div>
													<motion.div layout className="truncate">
														{t(
															item.title as "account" | "settings" | "sign out",
														)}
													</motion.div>
													<IconChevronRight className="ml-auto transition-transform duration-300 ease-in-out group-data-[state=open]/collapsible:rotate-90" />
												</AnimatedSidebarMenuButton>
											</AnimatedCollapsibleTrigger>
											<CollapsibleContent className="">
												<AnimatePresence>
													{isActive && (
														<motion.div
															key={item.type + item.title}
															initial={{
																height: 0,
																opacity: 0,
															}}
															animate={{
																height: "auto",
																opacity: 1,
															}}
															exit={{
																height: 0,
																opacity: 0,
															}}
															transition={{
																type: "spring",
																bounce: 0.3,
															}}
															className="overflow-hidden"
														>
															<SidebarMenuSub>
																<motion.div
																	variants={dropdownMenuParentVariants}
																	initial="hidden"
																	animate="visible"
																	exit={"hidden"}
																>
																	{item.items?.map((subItem) => (
																		<motion.div
																			key={subItem.url}
																			variants={{
																				hidden: {
																					opacity: 0,
																					y: -20,
																					filter: "blur(5px)",
																				},
																				visible: {
																					opacity: 1,
																					y: 0,
																					filter: "blur(0px)",
																					transition: {
																						type: "spring",
																						bounce: 0.3,
																					},
																				},
																			}}
																		>
																			<SidebarMenuSubItem key={subItem.title}>
																				<SidebarMenuSubButton
																					size="md"
																					asChild
																					isActive={pathName.includes(
																						subItem.url,
																					)}
																				>
																					<Link href={subItem.url}>
																						{subItem.icon && <subItem.icon />}
																						<span>
																							{t(subItem.title as any)}
																						</span>
																					</Link>
																				</SidebarMenuSubButton>
																			</SidebarMenuSubItem>
																		</motion.div>
																	))}
																</motion.div>
															</SidebarMenuSub>
														</motion.div>
													)}
												</AnimatePresence>
											</CollapsibleContent>
										</AnimatedSidebarMenuItem>
									</AnimatedCollapsible>
								);
							}

							if (item.url === undefined) {
								return <></>;
							}

							const isActive =
								(pathName.includes(item.url) && item.url !== "/dashboard") ||
								pathName === item.url;

							return (
								<AnimatedSidebarMenuItem
									layout
									initial={false}
									key={item.title}
									className=""
								>
									<SidebarMenuButton
										size={"lg"}
										isActive={isActive}
										asChild
										tooltip={t(item.title as any)}
									>
										<Link href={item.url}>
											<div className="flex aspect-square size-8 items-center justify-center rounded-lg">
												{item.icon && <item.icon className="size-6" />}
											</div>
											<span className="truncate">{t(item.title as any)}</span>
										</Link>
									</SidebarMenuButton>
								</AnimatedSidebarMenuItem>
							);
						})}
					</SidebarMenu>
				</SidebarGroup>
			</SidebarContent>
			<SidebarFooter>
				<SidebarMenu className="space-y-1">
					<SidebarMenuButton
						onClick={toggleSidebar}
						size={"lg"}
						tooltip={"CTRL + B"}
					>
						<div className="flex aspect-square size-8 items-center justify-center rounded-lg">
							<IconLayoutSidebar className="size-6" />
						</div>
						{t("collapse")}
					</SidebarMenuButton>

					<SidebarMenuItem>
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<SidebarMenuButton
									size={"lg"}
									isActive={profileSettingsIsActive}
									className=""
								>
									<div className="flex items-center gap-3">
										<div className="flex aspect-square size-8 items-center justify-center ">
											<Avatar
												className={cn(
													"transition-all duration-200 ease-in-out",
													!open ? "!rounded-md" : "",
												)}
											>
												<AvatarImage asChild src={profile?.photoUrl}>
													<Image
														width={40 * 2}
														height={40 * 2}
														src={profile?.photoUrl}
														alt={profile?.name}
														className="!rounded-md object-cover "
													/>
												</AvatarImage>
												<AvatarFallback>
													{profile?.name
														?.split(" ")
														.map((name: string) => name[0])
														.join("")}
												</AvatarFallback>
											</Avatar>
										</div>
										<span className="truncate">{profile?.name}</span>
									</div>

									<IconChevronUp className="ml-auto transition-transform ease-in-out " />
								</SidebarMenuButton>
							</DropdownMenuTrigger>
							<DropdownMenuContent
								side="top"
								className="w-[--radix-popper-anchor-width]"
							>
								<motion.div
									variants={dropdownMenuParentVariants}
									initial="hidden"
									animate="visible"
								>
									{profileSettings.map((item) => (
										<motion.div
											key={item.title}
											variants={dropdownMenuVariants}
										>
											{item.danger && <DropdownMenuSeparator />}
											<DropdownMenuItem
												asChild
												className={cn(
													"gap-2",
													item.danger
														? "flex gap-2 border-red-500/50 bg-red-500/5 text-red-800 hover:bg-red-500/50 focus:bg-red-500/50 dark:text-red-200"
														: "",
												)}
											>
												<Link
													href={item.url}
													className="flex items-center gap-2"
												>
													{item.icon && <item.icon />}
													{t(item.title as any)}
												</Link>
											</DropdownMenuItem>
										</motion.div>
									))}
								</motion.div>
							</DropdownMenuContent>
						</DropdownMenu>
					</SidebarMenuItem>
				</SidebarMenu>
			</SidebarFooter>
			<SidebarRail />
		</Sidebar>
	);
}
