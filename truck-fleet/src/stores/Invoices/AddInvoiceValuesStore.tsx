import { customerConverter } from "@/lib/converters/customerConverter";
import { db, storage } from "@/lib/firebase";
import type { Customer } from "@/types/customer";
import type { Invoice, InvoiceItem } from "@/types/invoice";
import {
	addDoc,
	collection,
	doc,
	getDoc,
	getDocs,
	limit,
	orderBy,
	query,
} from "firebase/firestore";
import {
	type StorageReference,
	deleteObject,
	getDownloadURL,
	ref,
	uploadBytes,
} from "firebase/storage";
import { v4 as uuidv4 } from "uuid";
import { custom, z } from "zod";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { generateObject } from "ai";
import { myGemini, myOpenAi } from "@/lib/ai";
import { openai } from "@ai-sdk/openai";

interface InvoiceValuesStore {
	invoiceNumber: string | undefined;
	issueDate: Date;
	dueDate: Date;
	from: string;
	to: string;
	items: InvoiceItem[];
	logo?: { link: string; ref: StorageReference };
	vat: number | undefined;
	bankDetails: string;
	note: string;
	discount: number | undefined;
	dealDetails: string;
	isLoading: boolean;
	tabIndex: number;
	openSheet: boolean;
	customers: Customer[];
	selectedCustomer: Customer | null;

	open: (shouldOpen: boolean) => void;
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
	createInvoice: (
		companyId: string | null,
		currencyCode: string,
		dateFormat: string,
	) => Promise<void>;
	setSelectedCustomer: (customer: Customer) => void;
}

const defaultValues = {
	invoiceNumber: undefined,
	issueDate: new Date(),
	dueDate: new Date(),
	to: "",
	items: [
		{ id: uuidv4(), description: "", quantity: 0, price: 0 },
	] as InvoiceItem[],
	vat: undefined,
	note: "",
	discount: 0,
	dealDetails: "",
};

export const useInvoiceValuesStore = create<InvoiceValuesStore>()(
	persist(
		(set, get) => ({
			...defaultValues,
			logo: undefined,
			isLoading: true,
			openSheet: false,
			tabIndex: 0,
			customers: [],
			selectedCustomer: null,
			from: "",
			bankDetails: "",

			open: (shouldOpen: boolean) => set({ openSheet: shouldOpen }),
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
				set({ logo: { link: downloadURL, ref: storageRef } });
			},
			removeLogo: async (companyId: string) => {
				const logo = get().logo;

				if (logo === undefined) return;
				await deleteObject(logo.ref);

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
			reset: () => set({ ...defaultValues, openSheet: false }),
			load: async (companyId) => {
				set({ isLoading: true });
				// Load data
				const docRef = doc(db, "companies", companyId);
				const customers = collection(
					db,
					`companies/${companyId}/customers`,
				).withConverter(customerConverter);
				const docSnap = await getDoc(docRef);
				const customersSnap = await getDocs(customers);

				if (docSnap.exists()) {
					const profile = docSnap.data() as {
						name: string;
						address: string;
						country: string;
						phone: string;
						ownerEmail: string;
						vatNumber: string;
						bank: string;
						iban: string;
						bankCode: string;
					};

					set({
						from: `${profile.name}\n${profile.address}\n${profile.country}\n${profile.phone}\n${profile.ownerEmail}\n${profile.vatNumber}`,
						bankDetails: `${profile.bank}\n${profile.iban}\n${profile.bankCode}`,
					});
				}

				if (get().invoiceNumber === "INV-0001" || !get().invoiceNumber) {
					// Get last 3 invoices
					try {
						const invoicesRef = collection(
							db,
							`companies/${companyId}/invoices`,
						);
						const lastInvoicesSnapshot = await getDocs(
							query(invoicesRef, orderBy("createdAt", "desc"), limit(3)),
						);

						if (lastInvoicesSnapshot.docs.length === 0) {
							set({
								invoiceNumber: "INV-0001",
							});
						} else {
							const lastInvoiceNumbers = lastInvoicesSnapshot.docs.map(
								(doc) => doc.data().invoiceNumber,
							);

							const prompt = `Generate a new invoice number based on the last invoices: ${lastInvoiceNumbers.join(", ")}.`;
							console.log(prompt);

							const { object } = await generateObject({
								model: myGemini("gemini-1.5-flash-8b"),
								schema: z.object({
									name: z.string(),
								}),
								prompt,
							});

							console.log({ object });

							set({
								invoiceNumber: object.name,
							});
						}
					} catch (error) {
						console.log(error);
					}
				}

				if (customersSnap.docs.length > 0) {
					const customers = customersSnap.docs.map((doc) => doc.data());
					set({ customers });
				}

				set({ isLoading: false, openSheet: false });
			},
			createInvoice: async (companyId, currencyCode, dateFormat) => {
				if (!companyId) return;

				const state = get();
				const invoiceData: Partial<Invoice> = {
					invoiceNumber: state.invoiceNumber,
					issueDate: state.issueDate,
					dueDate: state.dueDate,
					from: state.from.replaceAll("\n", "|"),
					to: state.to.replaceAll("\n", "|"),
					items: state.items,
					logo: state.logo?.link ?? "", // Only store the URL
					vat: state.vat,
					bankDetails: state.bankDetails.replaceAll("\n", "|"),
					note: state.note.replaceAll("\n", "|"),
					discount: state.discount,
					dealDetails: state.dealDetails,
					createdAt: new Date(),
					status: "pending",
					total: state.items.reduce(
						(acc, item) =>
							acc +
							item.price * item.quantity +
							(item.price * item.quantity * (state.vat ?? 0)) / 100,
						0,
					),
					currencyCode,
					dateFormat,
				};

				const invoicesRef = collection(db, `companies/${companyId}/invoices`);
				await addDoc(invoicesRef, invoiceData);

				// Reset the store after successful creation
				get().reset();
			},
			setSelectedCustomer: (customer) => {
				console.log({ customer });
				set({
					selectedCustomer: customer,
					to: `${customer.name}\n${customer.address}\n${customer.email}\n${customer.phone}`,
				});
			},
		}),
		{
			name: "invoice-values",
			partialize: (state) => ({
				logo: state.logo,
				invoiceNumber: state.invoiceNumber,
			}),
		},
	),
);
