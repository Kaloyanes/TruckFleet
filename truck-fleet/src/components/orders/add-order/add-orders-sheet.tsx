"use client";
import React, { useEffect, useState } from "react";
import {
	Sheet,
	SheetClose,
	SheetContent,
	SheetTitle,
	SheetTrigger,
} from "../../ui/sheet";
import { Button } from "../../ui/button";
import { useTranslations } from "next-intl";
import { z } from "zod";
import AutoForm from "../../ui/auto-form";
import {
	addDoc,
	collection,
	doc,
	query,
	serverTimestamp,
	setDoc,
	where,
	type DocumentReference,
} from "firebase/firestore";
import { useCollectionOnce } from "react-firebase-hooks/firestore";
import { useUploadFile } from "react-firebase-hooks/storage";
import { db, storage } from "@/firebase/firebase";
import useCompanyId from "@/hooks/useCompanyId";

import SelectMenu from "./select-menu";
import { InputWithIcon } from "@/components/ui/input-with-icon";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { getDownloadURL, ref } from "firebase/storage";
import type { FirebaseError } from "firebase/app";
import type { Order } from "@/models/orders";

export default function AddOrdersSheet() {
	const t = useTranslations("AddOrderSheet");
	const companyId = useCompanyId();
	const { toast } = useToast();

	const [drivers, driverLoading, driverError] = useCollectionOnce(
		query(
			collection(db, "users"),
			where("companyId", "==", companyId),
			where("type", "==", "driver"),
		),
	);
	const [companies, companiesLoading, companiesError] = useCollectionOnce(
		query(collection(db, "companies")),
	);
	const [trucks, truckLoading, truckError] = useCollectionOnce(
		query(collection(db, "trucks"), where("companyId", "==", companyId)),
	);
	const [orders] = useCollectionOnce(
		query(collection(db, "orders"), where("companyId", "==", companyId)),
	);

	const [uploadFile, uploading, snapshot, error] = useUploadFile();

	if (driverError || companiesError || truckError) {
		console.error(driverError, companiesError, truckError);
	}

	const [driverName, setDriverName] = useState("");
	const [driverRef, setDriverRef] = useState<DocumentReference | null>(null);

	const [licensePlate, setTruckPlate] = useState("");
	const [truckRef, setTruckRef] = useState<DocumentReference | null>(null);

	const [companyName, setCompanyName] = useState("");
	const [companyRef, setCompanyRef] = useState<DocumentReference | null>(null);

	const [values, setValues] = useState<Order | null>(null);
	const [open, setOpen] = useState(false);

	const sheetFormSchema = z.object({
		status: z
			.enum(["Picking Up", "In Delivery", "Delivered"])
			.default("Picking Up"),
		driver: z.any().refine((data) => data != null, "Driver is required"),
		truck: z.any().refine((data) => data != null, "Truck is required"),
		company: z.object({
			name: z.string().min(1),
			worker: z.string().min(1),
		}),
		palletes: z
			.array(
				z.object({
					width: z.coerce.number().default(1),
					length: z.coerce.number().default(1),
					height: z.coerce.number().default(1),
					weight: z.coerce.number().default(1),
				}),
			)
			.nonempty("Palletes must have at least one item")
			.default([
				{
					width: 1,
					length: 1,
					height: 1,
					weight: 1,
				},
			]),
		pickUps: z
			.array(
				z.object({
					address: z.string(),
					start: z.coerce.date(),
					end: z.coerce.date(),
				}),
			)
			.nonempty("Pickups must have at least one item")
			.default([
				{
					address: "",
					start: new Date(),
					end: new Date(),
				},
			]),
		deliveries: z
			.array(
				z.object({
					address: z.string(),
					start: z.coerce.date(),
					end: z.coerce.date(),
				}),
			)
			.nonempty("Deliveries must have at least one item")
			.default([
				{
					address: "",
					start: new Date(),
					end: new Date(),
				},
			]),
		documents: z.instanceof(File).optional(),
		note: z.string().optional(),
	});

	const addOrder = async (values: Order | null) => {
		if (!values || !companyId || !companyRef || !driverRef || !truckRef) {
			toast({
				title: "Error",
				description: "Some required fields are missing.",
				variant: "destructive",
			});
			return;
		}

		const currentDate = new Date();
		const numbers = licensePlate.match(/\d+/g)?.join("") ?? "";
		const id = `${currentDate.getFullYear()}${currentDate.getMonth()}${currentDate.getDate()}${numbers}${orders?.docs.length}`;

		try {
			if (values.documents) {
				const document = values.documents as File;
				const fileRef = ref(
					storage,
					`orders/${companyId}/${id}/${document.name}`,
				);

				await uploadFile(fileRef, document, {
					contentType: document.type,
				});

				const downloadUrl = await getDownloadURL(fileRef);
				values.documents = {
					name: document.name,
					url: downloadUrl,
				};
			}

			values.createdAt = new Date();

			await setDoc(doc(db, `/orders/${id}`), { ...values });

			toast({
				title: "Success",
				description: "Order added successfully",
				variant: "success",
			});

			setOpen(false);
		} catch (error) {
			console.error("Error adding order:", error);
			toast({
				title: "Error",
				description: "An error occurred while adding the order.",
				variant: "destructive",
			});
		}
	};

	return (
		<Sheet open={open} onOpenChange={setOpen}>
			<SheetTrigger>
				<Button>{t("title")}</Button>
			</SheetTrigger>
			<SheetContent className="overflow-y-scroll">
				{!driverLoading && !companiesLoading && (
					<>
						<SheetTitle className="w-full py-6">{t("title")}</SheetTitle>
						<AutoForm
							formSchema={sheetFormSchema}
							onValuesChange={(formValues) => {
								if (
									driverRef &&
									truckRef &&
									companyRef &&
									formValues.documents
								) {
									setValues({
										id: "",
										status: formValues.status ?? "Picking Up",
										driver: driverRef,
										truck: truckRef,
										companyId: companyId ?? "",
										company: {
											ref: companyRef,
											name: companyName,
											worker: formValues.company?.worker ?? "",
										},
										palletes: formValues.palletes ?? [],
										pickUps: formValues.pickUps ?? [],
										deliveries: formValues.deliveries ?? [],
										documents: formValues.documents,
										note: formValues.note ?? "",
										createdAt: new Date(),
										licensePlate: licensePlate,
									});
								}
							}}
							className="w-full p-2 flex flex-col gap-6"
							fieldConfig={{
								documents: {
									fieldType: "file",
								},
								driver: {
									renderParent: ({ children }) => (
										<SelectMenu
											selectedValue={driverName}
											setValue={setDriverName}
											values={drivers}
											setRef={setDriverRef}
											selectText="Select Driver"
											filterText="Filter Drivers"
											addText="Add Driver"
											field="name"
										/>
									),
								},
								truck: {
									renderParent: ({ children }) => (
										<SelectMenu
											selectedValue={licensePlate}
											setValue={setTruckPlate}
											values={trucks}
											setRef={setTruckRef}
											selectText="Select Truck"
											filterText="Filter Trucks"
											addText="Add Truck"
											field="licensePlate"
										/>
									),
								},
								company: {
									name: {
										renderParent: ({ children }: any) => (
											<SelectMenu
												selectedValue={companyName}
												setValue={setCompanyName}
												values={companies}
												setRef={setCompanyRef}
												selectText="Select Company"
												filterText="Filter Companies"
												addText="Add Company"
												field="name"
											/>
										),
									},
								},
								palletes: {
									width: {
										renderParent: ({ children }: any) => (
											<div className="flex flex-col gap-2">
												<Label>Width</Label>
												<InputWithIcon
													inputMode="numeric"
													inputProps={{
														type: "number",
													}}
													position="trailing"
													icon={<h1>cm</h1>}
												/>
											</div>
										),
									},
									length: {
										renderParent: ({ children }: any) => (
											<div className="flex flex-col gap-2">
												<Label>Length</Label>
												<InputWithIcon
													inputMode="numeric"
													inputProps={{
														type: "number",
													}}
													position="trailing"
													icon={<h1>cm</h1>}
												/>
											</div>
										),
									},
									height: {
										renderParent: ({ children }: any) => (
											<div className="flex flex-col gap-2">
												<Label>Height</Label>
												<InputWithIcon
													inputMode="numeric"
													inputProps={{
														type: "number",
													}}
													position="trailing"
													icon={<h1>cm</h1>}
												/>
											</div>
										),
									},
									weight: {
										renderParent: ({ children }: any) => (
											<div className="flex flex-col gap-2">
												<Label>Weight</Label>
												<InputWithIcon
													inputMode="numeric"
													inputProps={{
														type: "number",
													}}
													position="trailing"
													icon={<h1>kg</h1>}
												/>
											</div>
										),
									},
								},
							}}
						>
							<div className="flex sticky bottom-0 justify-center items-center gap-4">
								<SheetClose>
									<Button type="button" variant="outline">
										{t("cancel")}
									</Button>
								</SheetClose>
								<Button onClick={() => addOrder(values)} type="submit">
									{t("submit")}
								</Button>
							</div>
						</AutoForm>
					</>
				)}
			</SheetContent>
		</Sheet>
	);
}
