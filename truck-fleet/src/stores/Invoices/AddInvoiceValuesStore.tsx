import { CustomerConverter } from "@/lib/converters/CustomerConverter";
import { db, storage } from "@/lib/Firebase";
import type { Customer } from "@/types/client";
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
	updateDoc,
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
import { myGemini, myOpenAi } from "@/lib/AI";
import { openai } from "@ai-sdk/openai";
import { createInvoiceSchema } from "@/lib/validators/InvoiceValidator";
import type { ZodError } from "zod";
import { InvoiceConverter } from "@/lib/converters/InvoiceConverter";
import { useInvoiceOptionsStore } from "./AddInvoiceOptionsStore";

interface InvoiceValuesStore {
	invoiceNumber: string | undefined;
	issueDate: Date;
	dueDate: Date;
	from: string;
	to: string;
	items: InvoiceItem[];
	logo?: { link: string; ref: StorageReference };
	vat: number | null;
	bankDetails: string;
	note: string;
	discount: number | undefined;
	dealDetails: string;
	isLoading: boolean;
	tabIndex: number;
	open: boolean;
	customers: Customer[];
	selectedCustomer: Customer | null;
	errors: { [key: string]: string } | null;
	isEditing: boolean;
	editId: string | null;

	openSheet: (shouldOpen: boolean) => void;
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
		invoiceId?: string,
	) => Promise<void>;
	setSelectedCustomer: (customer: Customer) => void;
	validateForm: (companyId: string) => boolean;
	loadInvoiceData: (companyId: string, editId: string) => void;
	startEditing: (companyId: string, invoiceId: string) => Promise<void>;
}

let defaultValues: {
	issueDate: Date;
	dueDate: Date;
	from: string;
	to: string;
	items: InvoiceItem[];
	logo?: { link: string; ref: StorageReference };
	vat: number | null;
	bankDetails: string;
	note: string;
	discount: number | undefined;
	dealDetails: string;
	isEditing: boolean;
	editId: string | null;
} = {
	issueDate: new Date(),
	dueDate: new Date(),
	to: "",
	items: [
		{ id: uuidv4(), description: "", quantity: 0, price: 0 },
	] as InvoiceItem[],
	vat: null,
	note: "",
	discount: 0,
	dealDetails: "",
	isEditing: false,
	editId: null,
	from: "",
	bankDetails: "",
};

export const useInvoiceValuesStore = create<InvoiceValuesStore>()(
	persist(
		(set, get) => ({
			...defaultValues,
			invoiceNumber: undefined,
			logo: undefined,
			isLoading: true,
			open: false,
			tabIndex: 0,
			customers: [],
			selectedCustomer: null,
			from: "",
			bankDetails: "",
			errors: null,
			isEditing: false,
			editId: null,

			openSheet: (shouldOpen: boolean) => {
				set({ open: shouldOpen });

				if (get().isEditing) {
					set({ isEditing: false });
					set({ editId: null });
					get().reset();
				}
			},
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
			reset: () => {
				set({
					...defaultValues,
					open: false,
					errors: null,
					customers: [],
					selectedCustomer: null,
					isEditing: false,
					editId: null,
				});

				// Reset options store as well
				useInvoiceOptionsStore.getState().resetOptions();
			},
			loadInvoiceData: async (companyId, editId) => {
				const invoicesRef = collection(db, `companies/${companyId}/invoices`);
				const docSnap = await getDoc(
					doc(invoicesRef, editId).withConverter(InvoiceConverter),
				);

				if (docSnap.exists()) {
					const data = docSnap.data() as Invoice;
					set({
						invoiceNumber: data.invoiceNumber,
						issueDate: data.issueDate,
						dueDate: data.dueDate,
						from: data.from.replaceAll("|", "\n"),
						to: data.to.replaceAll("|", "\n"),
						items: data.items,
						vat: data.vat ?? null, // Ensure proper VAT handling
						bankDetails: data.bankDetails.replaceAll("|", "\n"),
						note: data.note.replaceAll("|", "\n"),
						discount: data.discount,
						dealDetails: data.dealDetails,
					});

					// Update options store with actual VAT value
					const optionsStore = useInvoiceOptionsStore.getState();
					optionsStore.update({
						vat: data.vat !== null && data.vat > 0,
						discount: data.discount !== undefined && data.discount > 0,
					});
				}
				set({ isLoading: false });
			},
			load: async (companyId) => {
				set({ isLoading: true });

				// Load company data
				const docRef = doc(db, "companies", companyId);
				const docSnap = await getDoc(docRef);

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

					const newFrom = `${profile.name}\n${profile.address}\n${profile.country}\n${profile.phone}\n${profile.ownerEmail}\n${profile.vatNumber}`;
					const newBankDetails = `${profile.bank}\n${profile.iban}\n${profile.bankCode}`;

					// Update both state and defaults
					set({
						from: newFrom,
						bankDetails: newBankDetails,
					});

					defaultValues = {
						...defaultValues,
						from: newFrom,
						bankDetails: newBankDetails,
					};
				}

				if (!get().invoiceNumber) {
					try {
						const invoicesRef = collection(
							db,
							`companies/${companyId}/invoices`,
						);
						const lastInvoicesSnapshot = await getDocs(
							query(invoicesRef, orderBy("createdAt", "desc"), limit(3)),
						);

						if (lastInvoicesSnapshot.docs.length === 0) {
							const newInvoiceNumber = "INV-0001";
							set({ invoiceNumber: newInvoiceNumber });
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
						const newInvoiceNumber = "INV-0001";
						set({ invoiceNumber: newInvoiceNumber });
					}
				}

				// Load customers
				const customersRef = collection(
					db,
					`companies/${companyId}/customers`,
				).withConverter(CustomerConverter);
				const customersSnap = await getDocs(customersRef);
				if (customersSnap.docs.length > 0) {
					set({ customers: customersSnap.docs.map((doc) => doc.data()) });
				}

				set({ isLoading: false });
			},
			validateForm: (companyId: string) => {
				const state = get();
				try {
					createInvoiceSchema(companyId).parse({
						invoiceNumber: state.invoiceNumber,
						issueDate: state.issueDate,
						dueDate: state.dueDate,
						from: state.from,
						to: state.to,
						items: state.items,
						bankDetails: state.bankDetails,
						vat: state.vat ?? null,
						note: state.note,
						discount: state.discount,
						dealDetails: state.dealDetails,
					});
					set({ errors: null });
					return true;
				} catch (error) {
					const zodError = error as ZodError;
					const errors =
						zodError.errors?.reduce(
							(acc, curr) => {
								acc[curr.path.join(".")] = curr.message;
								return acc;
							},
							{} as { [key: string]: string },
						) || {};

					console.log({ ...errors });
					set({ errors });
					return false;
				}
			},
			createInvoice: async (companyId, currencyCode, dateFormat) => {
				if (!companyId) return;

				const state = get();

				if (!state.validateForm(companyId)) {
					console.log("Validation failed");
					return;
				}

				const invoiceData: Partial<Invoice> = {
					invoiceNumber: state.invoiceNumber,
					issueDate: state.issueDate,
					dueDate: state.dueDate,
					from: state.from.replaceAll("\n", "|"),
					to: state.to.replaceAll("\n", "|"),
					items: state.items,
					logo: state.logo?.link ?? "", // Only store the URL
					vat: state.vat ?? null, // Ensure VAT is explicitly null when not set
					bankDetails: state.bankDetails.replaceAll("\n", "|"),
					note: state.note.replaceAll("\n", "|"),
					discount: state.discount,
					dealDetails: state.dealDetails,
					createdAt: new Date(),
					status: "pending",
					total: state.items.reduce((acc, item) => {
						const itemTotal = item.price * item.quantity;
						const vatAmount = state.vat ? (itemTotal * state.vat) / 100 : 0;
						return acc + itemTotal + vatAmount;
					}, 0),
					currencyCode,
					dateFormat,
				};

				const invoicesRef = collection(db, `companies/${companyId}/invoices`);

				if (state.isEditing && state.editId) {
					await updateDoc(doc(invoicesRef, state.editId), invoiceData);
				} else {
					await addDoc(invoicesRef, invoiceData);
				}

				// Reset the store after successful creation
				get().reset();
				set({ invoiceNumber: undefined });
			},
			setSelectedCustomer: (customer) => {
				console.log({ customer });
				set({
					selectedCustomer: customer,
					to: `${customer.name}\n${customer.address}\n${customer.email}\n${customer.phone}`,
				});
			},
			startEditing: async (companyId: string, invoiceId: string) => {
				set({ isEditing: true, editId: invoiceId });
				await get().loadInvoiceData(companyId, invoiceId);
				set({ open: true });
			},
		}),
		{
			name: "invoice-values",
			partialize: (state) => ({
				logo: state.logo,
				invoiceNumber: state.invoiceNumber,
				from: state.from,
				bankDetails: state.bankDetails,
			}),
		},
	),
);
