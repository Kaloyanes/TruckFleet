import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
	HoverCard,
	HoverCardContent,
	HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";
import {
	dropdownMenuParentVariants,
	dropdownMenuVariants,
} from "@/lib/DropdownMenuVariants";
import { Link } from "@/i18n/routing";
import { cn } from "@/lib/utils";
import type { Order } from "@/types/orders";
import { useOrderOptionsStore } from "@/stores/Orders/OrdersOptionsStore";
import {
	type Icon,
	IconCalendarFilled,
	IconDotsVertical,
	IconEdit,
	IconFilter,
	IconListDetails,
	IconMail,
	IconMenu2,
	IconPackage,
	IconPhone,
	type IconProps,
	IconStatusChange,
	IconTrash,
	IconTruckDelivery,
	IconUser,
	IconWeight,
} from "@tabler/icons-react";
import type { ColumnDef } from "@tanstack/react-table";
import type { DocumentReference } from "firebase/firestore";
import { motion } from "motion/react";
import { useTranslations } from "next-intl";
import type { ForwardRefExoticComponent, RefAttributes } from "react";
import { useDocumentData } from "react-firebase-hooks/firestore";
import { useCopyToClipboard } from "react-use";
import AnimatedHover from "./AnimatedHover";
import Locations from "./Locations";
import { DriverConverter } from "@/lib/converters/DriverConverter";
import { TruckConverter } from "@/lib/converters/TruckConverter";
import { CompanyConverter } from "@/lib/converters/CompanyConverter";

export const OrderColumns: ColumnDef<Order>[] = [
	{
		accessorKey: "select",
		header: "",
		cell: ({ row }) => (
			<Checkbox
				checked={row.getIsSelected()}
				onCheckedChange={(value) => row.toggleSelected(!!value)}
				aria-label="Select row"
			/>
		),
		size: 50,
		id: "select",
	},
	{
		accessorKey: "id",
		header(props) {
			const t = useTranslations("OrderList");

			return (
				<div className="flex items-center gap-2">
					<span>{t("orderId")}</span>
					<Popover>
						<PopoverTrigger asChild>
							<Button size={"icon"} className="h-8 w-8" variant={"outline"}>
								<IconFilter size={18} />
							</Button>
						</PopoverTrigger>
						<PopoverContent className="p-0">
							<div className="flex flex-col gap-2">
								<Input
									placeholder={t("searchOrderId")}
									value={
										(props.table.getColumn("id")?.getFilterValue() as string) ??
										""
									}
									onChange={(e) =>
										props.table.getColumn("id")?.setFilterValue(e.target.value)
									}
									type="number"
								/>
							</div>
						</PopoverContent>
					</Popover>
				</div>
			);
		},
		cell: ({ getValue }) => {
			const { toast } = useToast();
			const [state, copyToClipboard] = useCopyToClipboard();

			function handleCopy() {
				copyToClipboard((getValue() as string).trim());
				toast({
					title: "Copied to clipboard",
					variant: "success",
					duration: 2000,
				});
			}

			return (
				<span onClick={handleCopy} onKeyDown={handleCopy}>
					{getValue() as string}
				</span>
			);
		},
	},
	{
		accessorKey: "status",
		id: "status",
		header(props) {
			const t = useTranslations();

			const list = [
				{
					label: "OrderList.selectType",
					type: "label",
				},
				{
					type: "separator",
				},
				{
					label: "OrderList.all",
					type: "info",
					value: "",
				},
				{
					label: "AddOrderSheet.Pick Up",
					type: "info",
					value: "Pick Up",
				},
				{
					label: "AddOrderSheet.In Delivery",
					type: "info",
					value: "In Delivery",
				},
				{
					label: "AddOrderSheet.Delivered",
					type: "info",
					value: "Delivered",
				},
			];

			return (
				<div className="flex items-center gap-2">
					<span>{t("OrderList.status")}</span>
					<Popover>
						<PopoverTrigger asChild>
							<Button size={"icon"} className="h-8 w-8" variant={"outline"}>
								<IconFilter size={18} />
							</Button>
						</PopoverTrigger>
						<PopoverContent className="space-y-2 overflow-hidden">
							<RadioGroup
								defaultValue={
									(props.table
										.getColumn("status")
										?.getFilterValue() as string) ?? ""
								}
								onValueChange={(value) => {
									props.table.getColumn("status")?.setFilterValue(value);
								}}
							>
								<motion.div
									variants={dropdownMenuParentVariants}
									className="space-y-2 "
									initial="hidden"
									animate="visible"
								>
									{list.map((item, index) => (
										<motion.div
											key={index}
											variants={dropdownMenuVariants}
											className="w-fit"
										>
											{item.type === "label" && (
												<h1 className="flex items-center gap-2 font-semibold">
													<IconStatusChange />
													{t(item.label as any)}
												</h1>
											)}
											{item.type === "separator" && (
												<Separator className="-mx-6 my-1 h-px w-[50vw] bg-muted" />
											)}
											{item.type === "info" && (
												<div className="flex items-center space-x-2">
													<RadioGroupItem
														value={item.value as string}
														id={`r${index}`}
													/>
													<Label htmlFor={`r${index}`}>
														{t(item.label as any)}
													</Label>
												</div>
											)}
										</motion.div>
									))}
								</motion.div>
							</RadioGroup>
						</PopoverContent>
					</Popover>
				</div>
			);
		},
		cell: ({ getValue }) => {
			const status = getValue() as string;
			const t = useTranslations("AddOrderSheet");

			return <span>{t(status as any)}</span>;
		},
	},
	{
		accessorKey: "driver",
		header(props) {
			const t = useTranslations("OrderList");
			return <span>{t("driver")}</span>;
		},
		cell: ({ getValue }) => {
			const driverRef = getValue() as DocumentReference;

			const [driver] = useDocumentData(
				driverRef.withConverter(DriverConverter),
			);

			const t = useTranslations();

			const [clipboard, copyToClipboard] = useCopyToClipboard();

			const { toast } = useToast();

			if (!driver) return <span>{t("OrderList.noEmployeesFound")}</span>;

			function handleCopy(value: string) {
				copyToClipboard(value);
				toast({
					title: t("General.copiedToClipboard"),
					variant: "success",
					duration: 2000,
				});
			}

			const actions: {
				label?: string;
				type: "separator" | "info" | "label";
				value?: string;
				icon?:
					| ForwardRefExoticComponent<IconProps & RefAttributes<Icon>>
					| undefined;
				onClick?: () => void;
			}[] = [
				{
					label: "OrderList.driverDetails",
					type: "label",
					icon: IconListDetails,
				},
				{
					type: "separator",
				},
				{
					label: "LoginPage.email",
					type: "info",
					icon: IconMail,
					value: driver.email,
					onClick() {
						handleCopy(driver.email);
					},
				},
				{
					label: "OrderList.phone",
					type: "info",
					icon: IconPhone,
					value: driver.phone,
					onClick() {
						if (driver.phone) handleCopy(driver.phone);
					},
				},
			];

			return (
				<AnimatedHover actions={actions}>
					<div className="flex items-center gap-2">
						<Avatar>
							<AvatarImage src={driver.photoUrl} alt={driver.name} />
							<AvatarFallback>
								{(driver.name as string)
									?.split(" ")
									.map((name) => name[0])
									.join("")}
							</AvatarFallback>
						</Avatar>
						<p>{driver?.name}</p>
					</div>
				</AnimatedHover>
			);
		},
	},
	{
		accessorKey: "truck",
		header(props) {
			const t = useTranslations("OrderList");
			return <span>{t("truck")}</span>;
		},
		cell: ({ getValue }) => {
			const truckRef = getValue() as DocumentReference;
			const [truck] = useDocumentData(truckRef.withConverter(TruckConverter));

			const t = useTranslations("OrderList");

			const actions: {
				label?: string;
				type: "separator" | "info" | "label";
				value?: string;
				icon?:
					| ForwardRefExoticComponent<IconProps & RefAttributes<Icon>>
					| undefined;
				onClick?: () => void;
			}[] = [
				{
					label: "OrderList.truckDetails",
					type: "label",
					icon: IconListDetails,
				},
				{
					type: "separator",
				},
				{
					label: "OrderList.licensePlate",
					type: "info",
					icon: IconTruckDelivery,
					value: truck?.licensePlate,
				},
				{
					label: "OrderList.model",
					type: "info",
					icon: IconCalendarFilled,
					value: `${truck?.model} ${truck?.year}`,
				},
				{
					label: "OrderList.status",
					type: "info",
					icon: IconStatusChange,
					value: truck?.status,
				},
				{
					label: "OrderList.capacity",
					type: "info",
					icon: IconWeight,
					value: `${truck?.capacity} kg`,
				},
			];

			return (
				<AnimatedHover actions={actions}>{truck?.licensePlate}</AnimatedHover>
			);
		},
	},
	// Company
	{
		accessorKey: "company",
		header(props) {
			const t = useTranslations();
			return <span>{t("OrderList.company")}</span>;
		},
		cell: ({ getValue }) => {
			const companyInfo = getValue() as {
				name: string;
				ref: DocumentReference;
				worker: string;
			};

			const [company] = useDocumentData(
				companyInfo.ref.withConverter(CompanyConverter),
			);

			const { toast } = useToast();
			const [clipboard, copyToClipboard] = useCopyToClipboard();

			function handleCopy(value: string) {
				copyToClipboard(value);
				toast({
					title: "Copied to clipboard",
					variant: "success",
					duration: 2000,
				});
			}

			const actions: {
				label?: string;
				type: "separator" | "info" | "label";
				value?: string;
				icon?:
					| ForwardRefExoticComponent<IconProps & RefAttributes<Icon>>
					| undefined;
				onClick?: () => void;
			}[] = [
				{
					label: "OrderList.companyDetails",
					type: "label",
					icon: IconListDetails,
				},
				{
					type: "separator",
				},
				{
					label: "OrderList.worker",
					type: "info",
					icon: IconUser,
					value: companyInfo.worker,
				},
				{
					label: "OrderList.email",
					type: "info",
					icon: IconMail,
					value: company?.email,
					onClick() {
						handleCopy(company?.email as string);
					},
				},
			];

			return (
				<AnimatedHover actions={actions}>
					<div className="flex items-center gap-2">
						{/* <Avatar>
              <AvatarImage src={company?.logoUrl} alt={company?.name} />
              <AvatarFallback>
                {(company?.name as string)
                  ?.split(" ")
                  .map((name) => name[0])
                  .join("")}
              </AvatarFallback>
            </Avatar> */}
						<p>{company?.name}</p>
					</div>
				</AnimatedHover>
			);
		},
	},

	// Palletes
	{
		accessorKey: "palletes",
		header(props) {
			const t = useTranslations("OrderList");
			return <span>{t("palletes")}</span>;
		},
		cell: ({ getValue }) => {
			const palletes = getValue() as {
				height: number;
				length: number;
				weight: number;
				width: number;
			}[];

			// TODO: CHANGE THIS TO ANIMATED HOVER
			const t = useTranslations("OrderList");

			return (
				<HoverCard openDelay={150} closeDelay={150}>
					<HoverCardTrigger>
						<span>
							{palletes.length}{" "}
							{palletes.length === 1 ? t("palette") : t("palletes")}
						</span>
					</HoverCardTrigger>
					<HoverCardContent className="overflow-hidden">
						<motion.div
							variants={dropdownMenuParentVariants}
							initial="hidden"
							animate="visible"
							className="flex flex-col gap-2 "
						>
							<motion.div
								variants={dropdownMenuVariants}
								className="flex items-center gap-2"
							>
								<IconPackage />
								<span className="font-semibold">{t("palletes")}</span>
							</motion.div>

							<motion.div variants={dropdownMenuVariants}>
								<Separator className="-mx-6 my-1 h-px w-[50vw] bg-muted" />
							</motion.div>

							{palletes.map((pallete, index) => (
								<motion.div variants={dropdownMenuVariants} key={index}>
									{index + 1}. {pallete.height}x{pallete.width}x{pallete.length}{" "}
									{pallete.weight}kg
								</motion.div>
							))}
						</motion.div>
					</HoverCardContent>
				</HoverCard>
			);
		},
	},

	// Locations
	{
		id: "locations",
		accessorFn: (value) => {
			return [...value.pickUps, ...value.deliveries];
		},
		header(props) {
			const t = useTranslations("OrderList");
			return <span>{t("locations")}</span>;
		},
		cell({ getValue }) {
			const values = getValue() as {
				address: string;
				start: Date;
				end: Date;
			}[];

			values.sort((a, b) => a.start.getTime() - b.start.getTime());

			return <Locations locations={values} />;
		},
	},

	// documents
	{
		accessorKey: "documents",
		header(props) {
			const t = useTranslations("OrderList");
			return <span>{t("documents")}</span>;
		},
		cell: ({ getValue }) => {
			const documents = getValue() as { name: string; url: string } | null;
			if (!documents) {
				return <span>No documents</span>;
			}

			return (
				<Link href={documents.url} target="_blank" rel="noreferrer">
					<Button variant={"outline"}>{documents.name}</Button>
				</Link>
			);
		},
	},
	// note
	{
		accessorKey: "note",
		header(props) {
			const t = useTranslations("OrderList");
			return <span>{t("note")}</span>;
		},
		cell: ({ getValue }) => {
			const note = getValue() as string;

			if (note.length === 0) {
				return <span>No notes</span>;
			}

			return (
				<HoverCard openDelay={150} closeDelay={50}>
					<HoverCardTrigger>
						<span>{note.length > 50 ? `${note.slice(0, 50)}...` : note}</span>
					</HoverCardTrigger>
					<HoverCardContent className="h-full whitespace-normal">
						{note}
					</HoverCardContent>
				</HoverCard>
			);
		},
	},
	{
		accessorKey: "actions",
		header: "",
		cell: ({ row }) => {
			// const { setOpen, setOrder } = useEditOrderContext();
			// const { setConfirm, setOrder: setOrderConfirm } = useDeleteOrderContext();
			const { setOrder, openEditSheet, openDeleteDialog } =
				useOrderOptionsStore();

			const t = useTranslations("OrderList");

			const actions = [
				{
					label: "actions",
					type: "label",
				},
				{
					type: "seperator",
				},
				{
					type: "button",
					label: "details",
					icon: IconListDetails,
					onClick: () => {
						row.toggleSelected(!row.getIsSelected());
					},
				},
				{
					type: "button",
					label: "edit",
					icon: IconEdit,
					onClick: () => {
						setOrder(row.original);
						openEditSheet(true);
					},
				},
				{
					type: "seperator",
				},
				{
					danger: true,
					type: "button",
					label: "delete",
					icon: IconTrash,
					onClick: () => {
						setOrder(row.original);
						openDeleteDialog(true);
					},
				},
			];

			return (
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button size={"icon"} variant={"outline"}>
							<IconDotsVertical />
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent className="w-[150px]" align="end">
						<motion.div
							variants={dropdownMenuParentVariants}
							initial="hidden"
							animate="visible"
						>
							{actions.map((action, index) => {
								return (
									<motion.div
										key={action.label}
										variants={dropdownMenuVariants}
									>
										{action.type === "label" && (
											<DropdownMenuLabel>
												{t(action.label as any)}
											</DropdownMenuLabel>
										)}

										{action.type === "seperator" && (
											<DropdownMenuSeparator key={index} />
										)}

										{action.type === "button" && (
											<DropdownMenuItem
												key={index}
												onClick={action.onClick}
												className={cn(
													"flex justify-between gap-2",
													action.danger
														? "flex gap-2 border-red-500/50 bg-red-500/5 text-red-800 hover:bg-red-500/50 focus:bg-red-500/50 dark:text-red-200"
														: "",
												)}
											>
												{t(action.label as any)}
												{action.icon && <action.icon />}
											</DropdownMenuItem>
										)}
									</motion.div>
								);
							})}
						</motion.div>
					</DropdownMenuContent>
				</DropdownMenu>
			);
		},
	},
];
