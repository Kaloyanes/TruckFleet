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

interface InvoiceValues {
	invoiceNumber: string;
	issueDate: Date;
	dueDate: Date;
	from: string;
	to: string;
	items: InvoiceItem[];
	logo?: string;
}

interface InvoiceValuesStore {
	values: InvoiceValues;
	setInvoiceNumber: (value: string) => void;
	setIssueDate: (date: Date) => void;
	setDueDate: (date: Date) => void;
	setFrom: (value: string) => void;
	setTo: (value: string) => void;
	setLogo: (value: string) => void;
	addItem: (item: InvoiceItem) => void;
	updateItem: (id: string, item: Partial<InvoiceItem>) => void;
	removeItem: (id: string) => void;
	reset: () => void;
}

const defaultValues: InvoiceValues = {
	invoiceNumber: "INV-0001",
	issueDate: new Date(),
	dueDate: new Date(),
	from: "",
	to: "",
	items: [],
	logo: undefined,
};

export const useInvoiceValuesStore = create<InvoiceValuesStore>()(
	persist(
		(set, get) => ({
			values: { ...defaultValues },
			setInvoiceNumber: (invoiceNumber) =>
				set((state) => ({
					values: { ...state.values, invoiceNumber },
				})),
			setIssueDate: (issueDate) =>
				set((state) => ({
					values: { ...state.values, issueDate },
				})),
			setDueDate: (dueDate) =>
				set((state) => ({
					values: { ...state.values, dueDate },
				})),
			setFrom: (from) =>
				set((state) => ({
					values: { ...state.values, from },
				})),
			setTo: (to) =>
				set((state) => ({
					values: { ...state.values, to },
				})),
			setLogo: (logo) =>
				set((state) => ({
					values: { ...state.values, logo },
				})),
			addItem: (item) =>
				set((state) => ({
					values: {
						...state.values,
						items: [...state.values.items, item],
					},
				})),
			updateItem: (id, updatedItem) =>
				set((state) => ({
					values: {
						...state.values,
						items: state.values.items.map((item) =>
							item.id === id ? { ...item, ...updatedItem } : item,
						),
					},
				})),
			removeItem: (id) =>
				set((state) => ({
					values: {
						...state.values,
						items: state.values.items.filter((item) => item.id !== id),
					},
				})),
			reset: () => set({ values: defaultValues }),
		}),
		{
			name: "invoice-values",
		},
	),
);
