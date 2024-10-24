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
import { useToast } from "@/components/ui/use-toast";
import { useDeleteOrderContext } from "@/context/orders/order-delete-context";
import { useEditOrderContext } from "@/context/orders/order-edit-context";
import { companyConverter } from "@/firebase/converters/companyConverter";
import { driverConverter } from "@/firebase/converters/driverConverter";
import { truckConverter } from "@/firebase/converters/truckConverter";
import {
	dropdownMenuParentVariants,
	dropdownMenuVariants,
} from "@/lib/dropdownMenuVariants";
import { cn } from "@/lib/utils";
import type { Order } from "@/models/orders";
import {
	Icon,
	IconArrowDown,
	IconCalendarFilled,
	IconEdit,
	IconFilter,
	IconListDetails,
	IconMail,
	IconMenu2,
	IconPhone,
	IconProps,
	IconStatusChange,
	IconTrash,
	IconTruckDelivery,
	IconUser,
	IconWeight,
} from "@tabler/icons-react";
import type { ColumnDef } from "@tanstack/react-table";
import type { DocumentReference } from "firebase/firestore";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { ForwardRefExoticComponent, RefAttributes } from "react";
import { useDocumentData } from "react-firebase-hooks/firestore";
import { useCopyToClipboard } from "react-use";
import AnimatedHover from "./AnimatedHover";
import Locations from "./Locations";

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
						<PopoverTrigger>
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
			return (
				<div className="flex items-center gap-2">
					<span>{t("OrderList.status")}</span>
					<Popover>
						<PopoverTrigger>
							<Button size={"icon"} className="h-8 w-8" variant={"outline"}>
								<IconFilter size={18} />
							</Button>
						</PopoverTrigger>
						<PopoverContent className="space-y-2">
							<h1 className="font-bold">{t("OrderList.selectType")}</h1>
							<RadioGroup
								defaultValue={
									(props.table
										.getColumn("status")
										?.getFilterValue() as string) ?? ""
								}
								onValueChange={(value) => {
									// if (value === "") value = "";

									props.table.getColumn("status")?.setFilterValue(value);
								}}
							>
								<div className="flex items-center space-x-2">
									<RadioGroupItem value="" id="r1" />
									<Label htmlFor="r1">{t("OrderList.all")}</Label>
								</div>
								<div className="flex items-center space-x-2">
									<RadioGroupItem value="Pick Up" id="r1" />
									<Label htmlFor="r1">{t("AddOrderSheet.Pick Up")}</Label>
								</div>
								<div className="flex items-center space-x-2">
									<RadioGroupItem value="In Delivery" id="r2" />
									<Label htmlFor="r2">{t("AddOrderSheet.In Delivery")}</Label>
								</div>
								<div className="flex items-center space-x-2">
									<RadioGroupItem value="Delivered" id="r3" />
									<Label htmlFor="r3">{t("AddOrderSheet.Delivered")}</Label>
								</div>
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
				driverRef.withConverter(driverConverter),
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
						handleCopy(driver.phone);
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
			const [truck] = useDocumentData(truckRef.withConverter(truckConverter));

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
			const t = useTranslations("OrderList");
			return <span>{t("company")}</span>;
		},
		cell: ({ getValue }) => {
			const companyInfo = getValue() as {
				name: string;
				ref: DocumentReference;
				worker: string;
			};

			const [company] = useDocumentData(
				companyInfo.ref.withConverter(companyConverter),
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

			return (
				<Popover>
					<PopoverTrigger>
						<Button size={"icon"} variant={"outline"}>
							<IconArrowDown />
						</Button>
					</PopoverTrigger>
					<PopoverContent>
						<motion.div
							initial={{ opacity: 0, scale: 0.7, y: -10 }}
							animate={{ opacity: 1, scale: 1, y: 0 }}
							exit={{ opacity: 0 }}
							transition={{
								duration: 0.3,
								delay: 0.1,
								type: "spring",
								bounce: 0.2,
							}}
							className="flex flex-col gap-2"
						>
							{palletes.map((pallete, index) => (
								<span key={index}>
									{index + 1}. {pallete.height}x{pallete.width}x{pallete.length}{" "}
									{pallete.weight}kg
								</span>
							))}
						</motion.div>
					</PopoverContent>
				</Popover>
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
			const { setOpen, setOrder } = useEditOrderContext();
			const { setConfirm, setOrder: setOrderConfirm } = useDeleteOrderContext();

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
						setOpen(true);
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
						setConfirm(true);
						setOrderConfirm(row.original);
					},
				},
			];

			return (
				<DropdownMenu>
					<DropdownMenuTrigger>
						<Button size={"icon"} variant={"outline"}>
							<IconMenu2 />
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
									<motion.div key={index} variants={dropdownMenuVariants}>
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
