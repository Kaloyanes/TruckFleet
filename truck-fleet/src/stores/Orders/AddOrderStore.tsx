import { create } from "zustand";
import { getDoc, doc, setDoc, updateDoc } from "firebase/firestore";
import { getDownloadURL, ref } from "firebase/storage";
import { db, storage } from "@/lib/Firebase";
import type { DocumentReference } from "firebase/firestore";
import type { Order } from "@/types/orders";
import { z } from "zod";

interface AddOrderStoreState {
	driverName: string;
	driverRef: DocumentReference | null;
	licensePlate: string;
	truckRef: DocumentReference | null;
	companyName: string;
	companyRef: DocumentReference | null;
	values: Order | null;
	initialValues: any;

	setDriverInfo: (name: string, ref: DocumentReference | null) => void;
	setTruckInfo: (plate: string, ref: DocumentReference | null) => void;
	setCompanyInfo: (name: string, ref: DocumentReference | null) => void;
	setValues: (values: Order | null) => void;
	setInitialValues: (values: any) => void;
	resetStore: () => void;

	populateData: (order: Order | null, companyId: string) => Promise<void>;
	addOrder: (
		values: Order | null,
		companyId: string | null,
		orders: any,
		existingOrder: Order | null,
		uploadFile: any,
		toast: any,
		openEditSheet: (show: boolean) => void,
	) => Promise<void>;

	setDriverName: (name: string) => void;
	setDriverRef: (ref: DocumentReference | null) => void;
	setTruckName: (plate: string) => void;
	setTruckRef: (ref: DocumentReference | null) => void;
	setCompanyName: (name: string) => void;
	setCompanyRef: (ref: DocumentReference | null) => void;
}

export const createSheetFormSchema = (t: (value: string) => string) =>
	z.object({
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
					start: z
						.preprocess((arg) => new Date(arg as string), z.date())
						.describe(t("start")),
					end: z
						.preprocess((arg) => new Date(arg as string), z.date())
						.describe(t("end")),
				}),
			)
			.describe(t("pickUps"))
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
					address: z.string().describe(t("address")),
					start: z
						.preprocess((arg) => new Date(arg as string), z.date())
						.describe(t("start")),
					end: z
						.preprocess((arg) => new Date(arg as string), z.date())
						.describe(t("end")),
				}),
			)
			.describe(t("deliveries"))
			.nonempty("Deliveries must have at least one item")
			.default([
				{
					address: "",
					start: new Date(),
					end: new Date(),
				},
			]),
		documents: z
			.custom((data) => {
				if (data instanceof File) return data as File;
				return data;
			})
			.describe(t("documents")),
		note: z.string().optional().describe(t("note")),
	});

export const useAddOrderStore = create<AddOrderStoreState>((set, get) => {
	return {
		driverName: "",
		driverRef: null,
		licensePlate: "",
		truckRef: null,
		companyName: "",
		companyRef: null,
		values: null,
		initialValues: null,

		setDriverInfo: (name, ref) => set({ driverName: name, driverRef: ref }),
		setTruckInfo: (plate, ref) => set({ licensePlate: plate, truckRef: ref }),
		setCompanyInfo: (name, ref) => set({ companyName: name, companyRef: ref }),
		setValues: (values) => set({ values }),
		setInitialValues: (values) => set({ initialValues: values }),
		resetStore: () =>
			set({
				driverName: "",
				driverRef: null,
				licensePlate: "",
				truckRef: null,
				companyName: "",
				companyRef: null,
				values: null,
				initialValues: null,
			}),

		populateData: async (order, companyId) => {
			if (!order) {
				get().resetStore();
				return;
			}

			set({ values: order });

			if (order.driver) {
				const driverData = await getDoc(order.driver);
				set({ driverRef: order.driver, driverName: driverData.data()?.name });
			}

			if (order.truck) {
				const truckData = await getDoc(order.truck);
				set({
					truckRef: order.truck,
					licensePlate: truckData.data()?.licensePlate,
				});
			}

			if (order.company?.ref) {
				set({
					companyRef: order.company.ref,
					companyName: order.company.name,
				});
			}

			set({
				initialValues: {
					status: order.status ?? "Pick Up",
					company: order.company,
					palletes: order.palletes.map((pallete) => ({
						width: pallete.width,
						length: pallete.length,
						height: pallete.height,
						weight: pallete.weight,
					})),
					pickUps: order.pickUps.map((pickup) => ({
						address: pickup.address,
						start: pickup.start,
						end: pickup.end,
					})),
					deliveries: order.deliveries.map((delivery) => ({
						address: delivery.address,
						start: delivery.start,
						end: delivery.end,
					})),
					note: order.note ?? "",
					licensePlate: order.licensePlate ?? "",
					truck: order.truck ?? null,
					driver: order.driver ?? null,
				},
			});
		},

		addOrder: async (
			values,
			companyId,
			orders,
			existingOrder,
			uploadFile,
			toast,
			openEditSheet,
		) => {
			if (companyId === null) {
				toast({
					title: "Error",
					description: "Company ID is missing.",
					variant: "destructive",
				});
				return;
			}

			const { companyRef, driverRef, truckRef, licensePlate } = get();

			if (!values || !companyRef || !driverRef || !truckRef) {
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
			const id = `${currentDate.getFullYear()}${currentDate.getMonth()}${currentDate.getDate()}${numbers}${
				orders?.docs.length ?? 0
			}`;

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
					values.documents = existingOrder?.documents;
				}

				values.createdAt = new Date();

				const docId = `companies/${companyId}/orders/${existingOrder?.id ?? id}`;

				if (existingOrder) {
					await updateDoc(doc(db, docId), { ...values });
				} else {
					await setDoc(doc(db, docId), {
						...values,
					});
				}

				toast({
					title: existingOrder
						? "Order edited successfully"
						: "Order added successfully",
					variant: "success",
				});

				openEditSheet(false);
				get().resetStore();
			} catch (error) {
				console.error("Error adding order:", error);
				toast({
					title: "Error",
					description: "An error occurred while adding the order.",
					variant: "destructive",
				});
			}
		},
		setDriverName: (name) => set({ driverName: name }),
		setDriverRef: (ref) => set({ driverRef: ref }),
		setTruckName: (plate) => set({ licensePlate: plate }),
		setTruckRef: (ref) => set({ truckRef: ref }),
		setCompanyName: (name) => set({ companyName: name }),
		setCompanyRef: (ref) => set({ companyRef: ref }),
	};
});
