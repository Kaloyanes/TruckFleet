import { db, storage } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import {
	deleteObject,
	getDownloadURL,
	ref,
	uploadBytes,
} from "firebase/storage";
import { v4 as uuidv4 } from "uuid";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface InvoiceItem {
	id: string;
	description: string;
	quantity: number;
	price: number;
	vat?: number;
	total: number;
}

interface InvoiceValuesStore {
	invoiceNumber: string;
	issueDate: Date;
	dueDate: Date;
	from: string;
	to: string;
	items: InvoiceItem[];
	logo?: string;
	vat?: number;
	bankDetails: string;
	note: string;
	discount?: number;
	dealDetails: string;
	isLoading: boolean;
	tabIndex: number;

	setInvoiceNumber: (value: string) => void;
	setIssueDate: (date: Date) => void;
	setDueDate: (date: Date) => void;
	setFrom: (value: string) => void;
	setTo: (value: string) => void;
	setLogo: (value: File, companyId: string) => void;
	removeLogo: (companyId: string) => void;
	setVat: (value: number) => void;
	setBankDetails: (value: string) => void;
	setNote: (value: string) => void;
	setDiscount: (value: number) => void;
	setDealDetails: (value: string) => void;
	addItem: (item: InvoiceItem) => void;
	updateItem: (id: string, item: Partial<InvoiceItem>) => void;
	removeItem: (id: string) => void;
	reset: () => void;
	load: (companyId: string) => Promise<void>;
}

const defaultValues = {
	invoiceNumber: "INV-0001",
	issueDate: new Date(),
	dueDate: new Date(),
	from: "",
	to: "",
	items: [
		{ id: uuidv4(), description: "", quantity: 0, price: 0, total: 0 },
	] as InvoiceItem[],
	logo: undefined,
	vat: undefined,
	bankDetails: "",
	note: "",
	discount: 0,
	dealDetails: "",
};

export const useInvoiceValuesStore = create<InvoiceValuesStore>()(
	persist(
		(set) => ({
			...defaultValues,
			isLoading: true,
			tabIndex: 0,
			setDiscount: (discount) => set({ discount }),
			setInvoiceNumber: (invoiceNumber) => set({ invoiceNumber }),
			setIssueDate: (issueDate) => set({ issueDate }),
			setDueDate: (dueDate) => set({ dueDate }),
			setFrom: (from) => set({ from }),
			setTo: (to) => set({ to }),
			setLogo: async (logo: File, companyId: string) => {
				// set({ logo });
				const storageRef = ref(
					storage,
					`invoices/${companyId}/${uuidv4()}${logo.name.split(".")[1]}`,
				);
				await uploadBytes(storageRef, logo);
				const downloadURL = await getDownloadURL(storageRef);
				set({ logo: downloadURL });
			},
			removeLogo: async (companyId: string) => {
				const storageRef = ref(storage, `invoices/${companyId}`);
				await deleteObject(storageRef);
				set({ logo: undefined });
			},
			setVat: (vat) => set({ vat }),
			setBankDetails: (bankDetails) => set({ bankDetails }),
			setNote: (note) => set({ note }),
			setDealDetails: (dealDetails) => set({ dealDetails }),
			addItem: (item) =>
				set((state) => ({
					items: [...state.items, item],
				})),
			updateItem: (id, updatedItem) =>
				set((state) => ({
					items: state.items.map((item) =>
						item.id === id ? { ...item, ...updatedItem } : item,
					),
				})),
			removeItem: (id) =>
				set((state) => ({
					items: state.items.filter((item) => item.id !== id),
				})),
			reset: () => set(defaultValues),
			load: async (companyId) => {
				set({ isLoading: true });
				// Load data
				const docRef = doc(db, "companies", companyId);
				const docSnap = await getDoc(docRef);

				if (docSnap.exists()) {
					const profile = docSnap.data();
					set({
						from: `${profile.name}\n${profile.address}\n${profile.country}\n${profile.phone}\n${profile.ownerEmail}\n${profile.vatNumber}`,
						bankDetails: `${profile.bank}\n${profile.iban}\n${profile.bankCode}`,
					});
				}

				set({ isLoading: false });
			},
		}),
		{
			name: "invoice-values",
			partialize: (state) => ({
				logo: state.logo,
			}),
		},
	),
);
