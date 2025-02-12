"use client";
import React, { useEffect } from "react";
import { useForm, FormProvider } from "react-hook-form"; // <-- Added FormProvider
import { zodResolver } from "@hookform/resolvers/zod";
import {
	Sheet,
	SheetTrigger,
	SheetContent,
	SheetHeader,
	SheetTitle,
	SheetDescription,
	SheetClose,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectTrigger,
	SelectValue,
	SelectContent,
	SelectItem,
} from "@/components/ui/select";
import {
	Tooltip,
	TooltipTrigger,
	TooltipContent,
} from "@/components/ui/tooltip";
import { IconPlus } from "@tabler/icons-react";
import { truckFormSchema } from "@/stores/Trucks/TruckFormStore";
import { useTruckStore } from "@/stores/Trucks/TrucksStore";
import useCompanyId from "@/hooks/useCompanyId";
// Removed unused Form import from "@/components/ui/form"
import {
	FormField,
	FormItem,
	FormControl,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { useTranslations } from "next-intl";
import { toast } from "@/components/ui/use-toast";

type TruckFormValues = {
	licensePlate: string;
	model: string;
	capacity: number;
	status: "On Route" | "Available" | "In Repair";
	year: number;
};

const AddTruckSheet = () => {
	const t = useTranslations("AddTruckSheet"); // <-- Initialize translation hook
	const [open, setOpen] = React.useState(false);

	const { createTruck, isEditingTruck, selectedTruck, editTruck } =
		useTruckStore();

	const defaultValues = {
		licensePlate: "",
		model: "",
		capacity: 0,
		status: "Available",
		year: new Date().getFullYear(),
	} as Omit<TruckFormValues, "id">;

	const form = useForm<TruckFormValues>({
		resolver: zodResolver(truckFormSchema),
		defaultValues: defaultValues,
		mode: "onSubmit",
		shouldUnregister: false,
		shouldFocusError: true,
	});

	useEffect(() => {
		if (selectedTruck && !open) {
			setOpen(isEditingTruck);
			form.reset(selectedTruck);
		}
	}, [isEditingTruck, selectedTruck, form, open]);

	const { companyId } = useCompanyId();

	const onSubmit = async (data: TruckFormValues) => {
		console.log("onSubmit triggered", data, companyId);
		if (!companyId || !data) {
			console.error("Company ID is missing.");
			return;
		}

		if (isEditingTruck) {
			try {
				await editTruck(true, data);
				toast({
					title: t("truckUpdatedSuccess"),
					description: t("truckUpdatedSuccessDescription"),
					variant: "success",
				});
				setOpen(false);
				form.reset();
			} catch (error) {
				console.error("Error updating truck:", error);
			}
			return;
		}

		try {
			await createTruck(companyId, data);
			toast({
				title: t("truckCreatedSuccess"),
				description: t("truckCreatedSuccessDescription"),
				variant: "success",
			});
			setOpen(false);
			form.reset();
		} catch (error) {
			console.error("Error creating truck:", error);
		}
	};

	return (
		<Sheet
			open={open}
			onOpenChange={(open) => {
				if (isEditingTruck && !open && selectedTruck !== null) {
					form.reset(defaultValues);
					editTruck(false, {});
				}

				setOpen(open);
			}}
		>
			<Tooltip>
				<SheetTrigger asChild>
					<TooltipTrigger asChild>
						<Button variant="outline" size="icon" onClick={() => setOpen(true)}>
							<IconPlus className="h-4 w-4" />
						</Button>
					</TooltipTrigger>
				</SheetTrigger>
				<TooltipContent>
					{t(isEditingTruck ? "editTooltip" : "addTooltip")}
				</TooltipContent>
			</Tooltip>
			<SheetContent>
				<SheetHeader>
					<SheetTitle>
						{t(isEditingTruck ? "editTruckTitle" : "addTruckTitle")}
					</SheetTitle>
					<SheetDescription>
						{t(isEditingTruck ? "editTruckDescription" : "addTruckDescription")}
					</SheetDescription>
				</SheetHeader>
				<FormProvider {...form}>
					<form
						className="space-y-4 my-4"
						onSubmit={form.handleSubmit(onSubmit)}
					>
						{/* License Plate Field */}
						<FormField
							control={form.control}
							name="licensePlate"
							render={({ field }) => (
								<FormItem>
									<FormLabel>{t("licensePlate")}</FormLabel>
									{/* <-- translated label */}
									<FormControl>
										<Input {...field} id="licensePlate" />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						{/* Model Field */}
						<FormField
							control={form.control}
							name="model"
							render={({ field }) => (
								<FormItem>
									<FormLabel>{t("model")}</FormLabel>
									{/* <-- translated label */}
									<FormControl>
										<Input {...field} id="model" />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						{/* Capacity Field */}
						<FormField
							control={form.control}
							name="capacity"
							render={({ field }) => (
								<FormItem>
									<FormLabel>{t("capacity")}</FormLabel>
									{/* <-- translated label */}
									<FormControl>
										<Input
											id="capacity"
											type="number"
											onChange={(e) => field.onChange(Number(e.target.value))}
											value={field.value}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="status"
							render={({ field }) => (
								<FormItem>
									<FormLabel>{t("status")}</FormLabel>
									<FormControl>
										<Select onValueChange={field.onChange} value={field.value}>
											<SelectTrigger>
												<SelectValue placeholder={t("selectStatus")} />
											</SelectTrigger>
											<SelectContent>
												<SelectItem value="Available">
													{t("available")}
												</SelectItem>
												<SelectItem value="On Route">{t("onRoute")}</SelectItem>
												<SelectItem value="In Repair">
													{t("inRepair")}
												</SelectItem>
											</SelectContent>
										</Select>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						{/* Year Field */}
						<FormField
							control={form.control}
							name="year"
							render={({ field }) => (
								<FormItem>
									<FormLabel>{t("year")}</FormLabel>{" "}
									<FormControl>
										<Input {...field} id="year" type="number" />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<div className="flex items-center justify-end gap-2">
							<SheetClose asChild>
								<Button
									variant={"outline"}
									size={"sm"}
									className="min-w-40"
									onClick={() => {
										form.reset(defaultValues); // reset form to default values
										if (isEditingTruck) {
											editTruck(false, {});
										}
										setOpen(false);
									}}
								>
									{t("cancel")}
								</Button>
							</SheetClose>
							<Button type="submit" className="min-w-40" size={"sm"}>
								{t(isEditingTruck ? "updateTruck" : "addTruck")}{" "}
							</Button>
						</div>
					</form>
				</FormProvider>
			</SheetContent>
		</Sheet>
	);
};

export default AddTruckSheet;
