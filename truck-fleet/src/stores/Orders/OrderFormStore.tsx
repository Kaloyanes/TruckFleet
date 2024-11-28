import { create } from "zustand";
import type { DocumentReference, QueryDocumentSnapshot } from "firebase/firestore";
import { db, storage } from "@/lib/firebase";
import type { Order } from "@/types/orders";
import { getDownloadURL, ref } from "firebase/storage";
import { doc, setDoc, updateDoc } from "firebase/firestore";
import { z } from "zod";

interface OrderFormState {
	values: Order | null;
	driverName: string;
	driverRef: DocumentReference | null;
	licensePlate: string;
	truckRef: DocumentReference | null;
	companyName: string;
	companyRef: DocumentReference | null;
  orderFormSchema: z.AnyZodObject;

	setValues: (values: Order | null) => void;
	setDriverInfo: (name: string, ref: DocumentReference | null) => void;
	setTruckInfo: (plate: string, ref: DocumentReference | null) => void;
	setCompanyInfo: (name: string, ref: DocumentReference | null) => void;
	resetForm: () => void;

	addOrder: (
		values: Order | null,
		companyId: string,
		orders: QueryDocumentSnapshot<Order>[],
		existingOrder?: Order,
	) => Promise<{
		success: boolean;
		message: string;
	}>;
}

export const useOrderFormStore = create<OrderFormState>((set, get) => ({
	values: null,
	driverName: "",
	driverRef: null,
	licensePlate: "",
	truckRef: null,
	companyName: "",
	companyRef: null,
  t: null


	orderFormSchema: z.object({
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
	}),
	setValues: (values) => set({ values }),
	setDriverInfo: (name, ref) => set({ driverName: name, driverRef: ref }),
	setTruckInfo: (plate, ref) => set({ licensePlate: plate, truckRef: ref }),
	setCompanyInfo: (name, ref) => set({ companyName: name, companyRef: ref }),
	resetForm: () =>
		set({
			values: null,
			driverName: "",
			driverRef: null,
			licensePlate: "",
			truckRef: null,
			companyName: "",
			companyRef: null,
		}),

	addOrder: async (values, companyId, orders, existingOrder) => {
		const { companyRef, driverRef, truckRef } = get();

		if (!values || !companyRef || !driverRef || !truckRef) {
			return {
				success: false,
				message: "Some required fields are missing.",
			};
		}

		const currentDate = new Date();
		const numbers = get().licensePlate.match(/\d+/g)?.join("") ?? "";
		const id = `${currentDate.getFullYear()}${currentDate.getMonth()}${currentDate.getDate()}${numbers}${
			orders?.docs.length ?? 0
		}`;

		try {
			if (
				values.documents instanceof File ||
				values.documents instanceof Blob
			) {
				const document = values.documents as File;
				const fileRef = ref(
					storage,
					`orders/${companyId}/${id}/${document.name}`,
				);
				// Note: uploadFile hook needs to be handled differently in the store
				// You might want to use the native uploadBytes from firebase/storage
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
				await setDoc(doc(db, docId), { ...values });
			}

			return {
				success: true,
				message: existingOrder
					? "Order edited successfully"
					: "Order added successfully",
			};
		} catch (error) {
			console.error("Error adding order:", error);
			return {
				success: false,
				message: "An error occurred while adding the order.",
			};
		}
	},
}));
