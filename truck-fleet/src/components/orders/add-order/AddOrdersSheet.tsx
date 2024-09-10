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
	collection,
	doc,
	getDoc,
	query,
	setDoc,
	updateDoc,
	where,
	type DocumentReference,
} from "firebase/firestore";
import { useCollectionOnce } from "react-firebase-hooks/firestore";
import { useUploadFile } from "react-firebase-hooks/storage";
import { db, storage } from "@/firebase/firebase";
import useCompanyId from "@/hooks/useCompanyId";

import SelectMenu from "./SelectMenu";
import { useToast } from "@/components/ui/use-toast";
import { getDownloadURL, ref } from "firebase/storage";
import type { Order } from "@/models/orders";
import { useEditOrderContext } from "@/context/orders/order-edit-context";
import {
	Drawer,
	DrawerContent,
	DrawerTitle,
	DrawerTrigger,
} from "@/components/ui/drawer";

export default function AddOrdersSheet() {
	const t = useTranslations("AddOrderSheet");
	const { companyId } = useCompanyId();
	const { toast } = useToast();

	const { open, setOpen, order, setOrder } = useEditOrderContext();

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

	const [values, setValues] = useState<Order | null>(order ?? null);

	useEffect(() => {
		if (driverRef && truckRef && companyRef) {
			setValues({
				...values,
				driver: driverRef,
				truck: truckRef,
				licensePlate: licensePlate,
				company: {
					ref: companyRef,
					name: companyName,
					worker: values?.company?.worker ?? "",
				},
			} as any);
		}
	}, [driverRef, truckRef, companyRef]);

	const sheetFormSchema = z.object({
		status: z
			.enum(["Pick Up", "In Delivery", "Delivered"])
			.default("Pick Up")
			.describe(t("status")),
		driver: z.any().refine((data) => data != null, "Driver is required"),
		truck: z.any().refine((data) => data != null, "Truck is required"),
		company: z
			.object({
				name: z.string().min(1),
				worker: z.string().min(1).describe(t("worker")),
			})
			.describe(t("company")),
		palletes: z
			.array(
				z.object({
					width: z.coerce.number().default(1).describe(t("width")),
					length: z.coerce.number().default(1).describe(t("length")),
					height: z.coerce.number().default(1).describe(t("height")),
					weight: z.coerce.number().default(1).describe(t("weight")),
				}),
			)
			.describe(t("palletes"))
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
					address: z.string().describe(t("address")),
					start: z.coerce.date().describe(t("start")),
					end: z.coerce.date().describe(t("end")),
				}),
			)
			.describe(t("pickUps"))
			.nonempty("Pickups must have at least one item")
			.default([
				(order?.pickUps as {
					address: string;
					start: Date;
					end: Date;
				}[] as any) ?? {
					address: "",
					start: new Date(),
					end: new Date(),
				},
			]),
		deliveries: z
			.array(
				z.object({
					address: z.string().describe(t("address")),
					start: z.coerce.date().describe(t("start")),
					end: z.coerce.date().describe(t("end")),
				}),
			)
			.describe(t("deliveries"))
			.nonempty("Deliveries must have at least one item")
			.default(
				(order?.deliveries as {
					address: string;
					start: Date;
					end: Date;
				}[] as any) ?? {
					address: "",
					start: new Date(),
					end: new Date(),
				},
			),
		documents: z
			.custom((data) => {
				if (data instanceof File) return data as File;

				return data;
			})
			.describe(t("documents")),
		note: z.string().optional().describe(t("note")),
	});

	const addOrder = async (values: Order | null) => {
		if (JSON.stringify(values) === JSON.stringify(order)) {
			setOpen(false);
			return;
		}

		if (!values || !companyRef || !driverRef || !truckRef) {
			// TODO: Add translations
			toast({
				title: "Error",
				description: "Some required fields are missing.",
				variant: "destructive",
			});
			console.error(values, companyId, companyRef, driverRef, truckRef);
			return;
		}

		const currentDate = new Date();
		const numbers = licensePlate.match(/\d+/g)?.join("") ?? "";
		const id = `${currentDate.getFullYear()}${currentDate.getMonth()}${currentDate.getDate()}${numbers}${orders?.docs.length ?? 0}`;

		try {
			if (
				values.documents !== undefined &&
				(values.documents instanceof File || values.documents instanceof Blob)
			) {
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
			} else {
				values.documents = order?.documents;
			}

			values.createdAt = new Date();
			console.log(order?.id);

			try {
				console.log(values);

				if (order) {
					await updateDoc(doc(db, `/orders/${order.id}`), { ...values });
				} else {
					await setDoc(doc(db, `/orders/${id}`), {
						...values,
					});
				}
			} catch (error) {
				console.error("Error adding order:", error);
				toast({
					title: "Error",
					description: "An error occurred while adding the order.",
					variant: "destructive",
				});
				return;
			}

			toast({
				title: t("success"),
				description: order
					? t("orderEditedSuccessfully")
					: t("orderAddedSuccessfully"),
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

	useEffect(() => {
		console.log(truckRef);
	}, [truckRef]);

	const [initialValues, setInitialValues] = useState<{
		status: "Picking Up" | "In Delivery" | "Delivered";
		driver: DocumentReference | undefined;
		truck: DocumentReference | undefined;
		companyId: string;
		company: {
			name: string;
			worker: string;
		};
		palletes: {
			height: number;
			length: number;
			weight: number;
			width: number;
		}[];
		pickUps: {
			address: string;
			start: Date;
			end: Date;
		}[];
		deliveries: {
			address: string;
			start: Date;
			end: Date;
		}[];
		documents: File | { name: string; url: string } | undefined;
		note: string;
	} | null>(null);

	useEffect(() => {
		async function populateData() {
			if (!order) {
				setDriverRef(null);
				setDriverName("");

				setTruckRef(null);
				setTruckPlate("");

				setCompanyRef(null);
				setCompanyName("");

				setValues(null);
				setInitialValues(null);
				return;
			}

			if (order) {
				setValues(order);
			}

			if (order?.driver) {
				const driverData = await getDoc(order.driver);
				setDriverRef(order.driver);
				setDriverName(driverData.data()?.name);
			}

			if (order?.truck) {
				const truckData = await getDoc(order.truck);
				setTruckRef(order.truck);
				setTruckPlate(truckData.data()?.licensePlate);
			}

			if (order?.company?.ref) {
				setCompanyRef(order.company.ref);
				setCompanyName(order.company.name);
			}

			setValues({
				status: order?.status ?? "Pick Up",
				company: order?.company,
				// driver: order?.driver,
				palletes: order?.palletes.map((pallete) => ({
					width: pallete.width,
					length: pallete.length,
					height: pallete.height,
					weight: pallete.weight,
				})),
				pickUps: order?.pickUps.map((pickup) => ({
					address: pickup.address,
					start: pickup.start,
					end: pickup.end,
				})) ?? [
					{
						address: "",
						start: new Date(),
						end: new Date(),
					},
				],
				deliveries: order?.deliveries.map((delivery) => ({
					address: delivery.address,
					start: delivery.start,
					end: delivery.end,
				})) ?? [
					{
						address: "",
						start: new Date(),
						end: new Date(),
					},
				],
				note: order?.note ?? "",
				licensePlate: order?.licensePlate ?? "",
				truck: order?.truck ?? null,
				driver: order?.driver ?? null,
			} as any);
		}

		populateData();
	}, [order]);

	function getDocumentDescription() {
		// return order
		// 	? `Uploading a new document will replace the current one. Current document is ${order.documents.name}`
		// 	: "";
		if (!order?.documents) {
			return "";
		}

		return (
			<div className="flex flex-col gap-2 text-md ">
				<h1>
					{order ? "Uploading a new document will replace the current one" : ""}
				</h1>
				<h1>{order ? `Current document is ${order.documents.name}` : ""}</h1>
			</div>
		);
	}

	return (
		<Sheet open={open} onOpenChange={setOpen}>
			<SheetTrigger>
				<Button
					onClick={() => {
						setOrder(null);
					}}
				>
					{t("title")}
				</Button>
			</SheetTrigger>
			<SheetContent className="overflow-y-scroll overflow-x-hidden ">
				{!driverLoading && !companiesLoading && !truckLoading && (
					<>
						<SheetTitle className="w-full py-6">
							{order ? `${t("editTitle")} #${order.id}` : t("title")}
						</SheetTitle>
						<AutoForm
							values={initialValues as any}
							formSchema={sheetFormSchema}
							onValuesChange={(formValues) => {
								console.log(formValues, driverRef, truckRef, companyRef);
								if (driverRef && truckRef && companyRef) {
									setValues({
										id: "",
										status: formValues.status ?? "Pick Up",
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
										note: formValues.note ?? "",
										createdAt: new Date(),
										licensePlate: licensePlate,
										documents: formValues.documents as any,
									});
								}
							}}
							className="w-full p-2 flex flex-col gap-6"
							fieldConfig={{
								documents: {
									fieldType: "file",
									description: getDocumentDescription(),
								},
								driver: {
									renderParent: ({ children }) => (
										<SelectMenu
											selectedValue={driverName}
											setValue={setDriverName}
											values={drivers}
											setRef={setDriverRef}
											selectText={t("selectDriver")}
											filterText={t("filterDrivers")}
											addText={t("addDriver")}
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
											selectText={t("selectTruck")}
											filterText={t("filterTrucks")}
											addText={t("addTruck")}
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
												selectText={t("selectCompany")}
												filterText={t("filterCompanies")}
												addText={t("addCompany")}
												field="name"
											/>
										),
									},
								},
							}}
						>
							<div className="flex sticky bottom-0 justify-center items-center gap-4 z-[99999999]">
								<SheetClose>
									<Button type="button" className="min-w-32" variant="outline">
										{t("cancel")}
									</Button>
								</SheetClose>
								<Button
									onClick={() => addOrder(values)}
									className="min-w-32"
									type="submit"
								>
									{order ? t("edit") : t("add")}
								</Button>
							</div>
						</AutoForm>
					</>
				)}
			</SheetContent>
		</Sheet>
	);
}
