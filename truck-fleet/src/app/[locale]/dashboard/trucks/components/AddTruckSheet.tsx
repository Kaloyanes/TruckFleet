"use client";
import React from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
	Sheet,
	SheetTrigger,
	SheetContent,
	SheetHeader,
	SheetTitle,
	SheetDescription,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Tooltip,
	TooltipTrigger,
	TooltipContent,
} from "@/components/ui/tooltip";
import { IconPlus } from "@tabler/icons-react";
import { truckFormSchema } from "@/stores/Trucks/TruckFormStore";
import {
	Select,
	SelectTrigger,
	SelectValue,
	SelectContent,
	SelectItem,
} from "@/components/ui/select";
import { useTruckStore } from "@/stores/Trucks/TrucksStore";
import useCompanyId from "@/hooks/useCompanyId";

type TruckFormValues = {
	licensePlate: string;
	model: string;
	capacity: number;
	status: "On Route" | "Available" | "In Repair";
	year: number;
};

const AddTruckSheet = () => {
	const [open, setOpen] = React.useState(false);
	const createTruck = useTruckStore((state) => state.createTruck);

	const {
		register,
		control,
		handleSubmit,
		formState: { errors },
		reset,
	} = useForm<TruckFormValues>({
		resolver: zodResolver(truckFormSchema),
		defaultValues: {
			licensePlate: "",
			model: "",
			capacity: 0,
			status: "Available",
			year: new Date().getFullYear(),
		},
	});

	const { companyId } = useCompanyId();

	const onSubmit = async (data: TruckFormValues) => {
		console.log("onSubmit triggered", data, companyId);
		if (!companyId) {
			console.error("Company ID is missing.");
			return;
		}
		try {
			await createTruck(companyId, data);
			console.log("Truck created successfully");
			reset();
			setOpen(false);
		} catch (error) {
			console.error("Error creating truck:", error);
		}
	};

	return (
		<Sheet open={open} onOpenChange={setOpen}>
			<Tooltip>
				<TooltipTrigger asChild>
					<SheetTrigger asChild>
						<Button variant="outline" size="icon" onClick={() => setOpen(true)}>
							<IconPlus className="h-4 w-4" />
						</Button>
					</SheetTrigger>
				</TooltipTrigger>
				<TooltipContent>Add Truck</TooltipContent>
			</Tooltip>
			<SheetContent>
				<SheetHeader>
					<SheetTitle>Add New Truck</SheetTitle>
					<SheetDescription>
						Fill in the truck details to add a new truck.
					</SheetDescription>
				</SheetHeader>
				<form onSubmit={handleSubmit(onSubmit)} className="space-y-4 my-4">
					<div>
						<Label htmlFor="licensePlate">License Plate</Label>
						<Input id="licensePlate" {...register("licensePlate")} />
						{errors.licensePlate && (
							<p className="text-sm text-red-600">
								{errors.licensePlate.message}
							</p>
						)}
					</div>
					<div>
						<Label htmlFor="model">Model</Label>
						<Input id="model" {...register("model")} />
						{errors.model && (
							<p className="text-sm text-red-600">{errors.model.message}</p>
						)}
					</div>
					<div>
						<Label htmlFor="capacity">Capacity (kg)</Label>
						<Input
							id="capacity"
							type="number"
							{...register("capacity", { valueAsNumber: true })}
						/>
						{errors.capacity && (
							<p className="text-sm text-red-600">{errors.capacity.message}</p>
						)}
					</div>
					<div>
						<Label htmlFor="status">Status</Label>
						<Controller
							control={control}
							name="status"
							render={({ field }) => (
								<Select onValueChange={field.onChange} value={field.value}>
									<SelectTrigger>
										<SelectValue placeholder="Select status" />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="On Route">On Route</SelectItem>
										<SelectItem value="Available">Available</SelectItem>
										<SelectItem value="In Repair">In Repair</SelectItem>
									</SelectContent>
								</Select>
							)}
						/>
						{errors.status && (
							<p className="text-sm text-red-600">{errors.status.message}</p>
						)}
					</div>
					<div>
						<Label htmlFor="year">Year</Label>
						<Input
							id="year"
							type="number"
							{...register("year", { valueAsNumber: true })}
						/>
						{errors.year && (
							<p className="text-sm text-red-600">{errors.year.message}</p>
						)}
					</div>
					<Button type="submit">Save Truck</Button>
				</form>
			</SheetContent>
		</Sheet>
	);
};

export default AddTruckSheet;
