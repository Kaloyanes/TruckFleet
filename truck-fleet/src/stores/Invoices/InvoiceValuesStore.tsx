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

	setInvoiceNumber: (value: string) => void;
	setIssueDate: (date: Date) => void;
	setDueDate: (date: Date) => void;
	setFrom: (value: string) => void;
	setTo: (value: string) => void;
	setLogo: (value: string) => void;
	setVat: (value: number) => void;
	setBankDetails: (value: string) => void;
	setNote: (value: string) => void;
	setDiscount: (value: number) => void;
	addItem: (item: InvoiceItem) => void;
	updateItem: (id: string, item: Partial<InvoiceItem>) => void;
	removeItem: (id: string) => void;
	reset: () => void;
}

const defaultValues = {
	invoiceNumber: "INV-0001",
	issueDate: new Date(),
	dueDate: new Date(),
	from: "",
	to: "",
	items: [
		{ id: uuidv4(), description: "New Item", quantity: 0, price: 0, total: 0 },
	] as InvoiceItem[],
	logo: undefined,
	vat: undefined,
	bankDetails: "",
	note: "",
	discount: 0,
};

export const useInvoiceValuesStore = create<InvoiceValuesStore>()(
	persist(
		(set) => ({
			...defaultValues,
			setDiscount: (discount) => set({ discount }),
			setInvoiceNumber: (invoiceNumber) => set({ invoiceNumber }),
			setIssueDate: (issueDate) => set({ issueDate }),
			setDueDate: (dueDate) => set({ dueDate }),
			setFrom: (from) => set({ from }),
			setTo: (to) => set({ to }),
			setLogo: (logo) => set({ logo }),
			setVat: (vat) => set({ vat }),
			setBankDetails: (bankDetails) => set({ bankDetails }),
			setNote: (note) => set({ note }),
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
		}),
		{
			name: "invoice-values",
			partialize: (state) => ({
				vat: state.vat,
				logo: state.logo,
				from: state.from,
				bankDetails: state.bankDetails,
			}),
		},
	),
);
