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
import {
	IconChartPie,
	IconChevronRight,
	IconChevronUp,
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
			title: "map",
			url: "/dashboard/map",
			icon: IconMap2,
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
	];

	const firstGroupIsActive = navMain
		.find((x) => x.type === "group")
		?.items?.some((item) => pathName.includes(item.url));

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
			title: "sign out",
			url: "/dashboard/sign-out",
			icon: IconLogout,
		},
	];

	const { toggleSidebar } = useSidebar();

	const profileSettingsIsActive = profileSettings.some((item) =>
		pathName.includes(item.url),
	);

	const t = useTranslations("SidebarLink");

	return (
		<Sidebar collapsible="icon">
			<SidebarHeader>
				<SidebarMenuButton
					size={"lg"}
					className="font-bold"
					tooltip={"Truck Fleet"}
				>
					<div className="flex aspect-square size-8 items-center justify-center rounded-lg">
						<IconPackages className="size-6" />
					</div>
					<div className="grid flex-1 text-left text-lg leading-tight">
						<span className="truncate font-semibold">Truck Fleet</span>
					</div>
				</SidebarMenuButton>
			</SidebarHeader>
			<SidebarContent>
				<SidebarGroup>
					<SidebarMenu className="space-y-1">
						{navMain.map((item) => {
							if (item.type === "group") {
								return (
									<Collapsible
										key={item.title}
										asChild
										className="group/collapsible"
										defaultOpen={firstGroupIsActive}
									>
										<SidebarMenuItem>
											<CollapsibleTrigger asChild>
												<SidebarMenuButton
													size={"lg"}
													tooltip={t(item.title as any)}
													isActive={firstGroupIsActive}
													className="z-50"
												>
													<div className="flex aspect-square size-8 items-center justify-center rounded-lg">
														{item.icon && (
															<item.icon className="size-6 flex-shrink-0" />
														)}
													</div>
													<span className="truncate">
														{t(item.title as any)}
													</span>
													<IconChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
												</SidebarMenuButton>
											</CollapsibleTrigger>
											<CollapsibleContent className="data-[state=closed]:fade-out-0 data-[state=closed]:slide-out-to-top-2 [state=closed]:zoom-out-95 data-[state=open]:fade-in-0 duration-300 ease-in-out data-[state=closed]:animate-out data-[state=open]:animate-in">
												<SidebarMenuSub>
													<AnimatePresence>
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
																		},
																		visible: {
																			opacity: 1,
																			y: 0,
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
																			isActive={pathName.includes(subItem.url)}
																		>
																			<Link href={subItem.url}>
																				{subItem.icon && <subItem.icon />}
																				<span>{t(subItem.title as any)}</span>
																			</Link>
																		</SidebarMenuSubButton>
																	</SidebarMenuSubItem>
																</motion.div>
															))}
														</motion.div>
													</AnimatePresence>
												</SidebarMenuSub>
											</CollapsibleContent>
										</SidebarMenuItem>
									</Collapsible>
								);
							}

							if (item.url === undefined) {
								return <></>;
							}

							const isActive =
								(pathName.includes(item.url) && item.url !== "/dashboard") ||
								pathName === item.url;

							return (
								<SidebarMenuItem key={item.title}>
									<SidebarMenuButton
										size={"lg"}
										isActive={isActive}
										asChild
										tooltip={t(item.title as any)}
									>
										<Link href={item.url}>
											<div className="flex aspect-square size-8 items-center justify-center rounded-lg">
												{item.icon && (
													<item.icon className="size-6 flex-shrink-0" />
												)}
											</div>
											<span className="truncate">{t(item.title as any)}</span>
										</Link>
									</SidebarMenuButton>
								</SidebarMenuItem>
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
						tooltip={t("collapse")}
					>
						<div className="flex aspect-square size-8 items-center justify-center rounded-lg">
							<IconLayoutSidebar className="size-6 flex-shrink-0" />
						</div>
						{/* TODO: ADD TOOLTIP FOR CTRL + B */}
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
									<div className="flex gap-3 items-center">
										<div className="flex aspect-square size-8 items-center justify-center rounded-lg">
											{/* <Image
											src={profile?.photoUrl}
											alt={profile?.username}
											width={24 * 2}
											height={24 * 2}
											className="size-6 rounded-full object-cover"
										/> */}
											<Avatar>
												<AvatarImage
													width={24 * 2}
													height={24 * 2}
													src={profile?.photoUrl}
													className="object-cover"
												/>
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

									<IconChevronUp className="ml-auto" />
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
											<DropdownMenuItem asChild>
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

// export function Logo({ open }: { open: boolean }) {
// 	return (
// 		<Link
// 			href="#"
// 			className="font-normal flex space-x-2 items-center text-sm text-white py-1 relative z-20"
// 		>
// 			<TruckIcon />

// 			<AnimatePresence>
// 				{open ? (
// 					<motion.span
// 						initial={{ opacity: 0, scale: 0 }}
// 						animate={{ opacity: 1, scale: 1 }}
// 						exit={{ opacity: 0, scale: 0 }}
// 						className="font-medium text-black dark:text-white whitespace-pre"
// 					>
// 						Truck Fleet
// 					</motion.span>
// 				) : (
// 					<></>
// 				)}
// 			</AnimatePresence>
// 		</Link>
// 	);
// }
