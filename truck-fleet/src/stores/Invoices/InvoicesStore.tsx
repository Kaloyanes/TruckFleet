import { invoiceConverter } from "@/lib/converters/invoiceConverter";
import { db } from "@/lib/firebase";
import type { Invoice } from "@/types/invoice";
import {
	collection,
	query,
	getDocs,
	orderBy,
	limit,
	startAfter,
	doc,
	updateDoc,
	where,
	type QueryDocumentSnapshot,
	onSnapshot,
	type Unsubscribe,
	deleteDoc,
} from "firebase/firestore";
import { create } from "zustand";

interface InvoicesStore {
	invoices: Invoice[];
	isLoading: boolean;
	hasMore: boolean;
	lastDoc: QueryDocumentSnapshot | null;
	unsubscribe: Unsubscribe | null;
	filteringText: string;
	openDeleteDialog: boolean;
	selectedInvoice: Invoice | null;

	setInvoice: (invoice: Invoice) => void;
	setDialogVisibility: (value: boolean) => void;
	setFilteringText: (text: string) => void;
	deleteInvoice: (companyId: string) => Promise<void>;
	loadInvoices: (
		companyId: string,
		status?: Invoice["status"],
	) => Promise<void>;
	loadMoreInvoices: (
		companyId: string,
		status?: Invoice["status"],
	) => Promise<void>;
	updateInvoiceStatus: (
		companyId: string,
		invoiceId: string,
		status: Invoice["status"],
	) => Promise<void>;
	reset: () => void;
}

export const useInvoicesStore = create<InvoicesStore>((set, get) => ({
	invoices: [],
	isLoading: false,
	hasMore: true,
	lastDoc: null,
	unsubscribe: null,
	filteringText: "",
	openDeleteDialog: false,
	selectedInvoice: null,

	setDialogVisibility: (value: boolean) => {
		set({ openDeleteDialog: value });
	},
	setInvoice: (invoice: Invoice) => {
		set({ selectedInvoice: invoice });
	},
	deleteInvoice: async (companyId: string) => {
		const { selectedInvoice } = get();

		if (!selectedInvoice) return;

		const invoiceRef = doc(
			db,
			`companies/${companyId}/invoices/${selectedInvoice.id}`,
		);

		await deleteDoc(invoiceRef);

		set({ openDeleteDialog: false, selectedInvoice: null });
	},
	setFilteringText: (text: string) => {
		set({ filteringText: text });
	},
	loadInvoices: async (companyId, status) => {
		// Cleanup existing subscription if any
		const unsubscribed = get().unsubscribe;
		if (unsubscribed) {
			unsubscribed();
		}

		set({ isLoading: true });

		const invoicesRef = collection(db, `companies/${companyId}/invoices`);
		const q = status
			? query(
					invoicesRef,
					where("status", "==", status),
					orderBy("createdAt", "desc"),
					limit(10),
				)
			: query(invoicesRef, orderBy("createdAt", "desc"), limit(10));

		const unsubscribe = onSnapshot(
			q.withConverter(invoiceConverter),
			(snapshot) => {
				const invoices = snapshot.docs.map((doc) => doc.data());
				set({
					invoices,
					lastDoc: snapshot.docs[snapshot.docs.length - 1] || null,
					hasMore: snapshot.docs.length === 10,
					isLoading: false,
				});
			},
		);

		set({ unsubscribe });
	},

	loadMoreInvoices: async (companyId, status) => {
		const { lastDoc, hasMore } = get();
		if (!hasMore || !lastDoc) return;

		set({ isLoading: true });
		try {
			const invoicesRef = collection(db, `companies/${companyId}/invoices`);
			const q = status
				? query(
						invoicesRef,
						where("status", "==", status),
						orderBy("createdAt", "desc"),
						startAfter(lastDoc),
						limit(10),
					)
				: query(
						invoicesRef,
						orderBy("createdAt", "desc"),
						startAfter(lastDoc),
						limit(10),
					);

			const snapshot = await getDocs(q);
			const newInvoices = snapshot.docs.map((doc) => ({
				id: doc.id,
				...doc.data(),
				issueDate: doc.data().issueDate.toDate(),
				dueDate: doc.data().dueDate.toDate(),
				createdAt: doc.data().createdAt.toDate(),
			})) as Invoice[];

			set((state) => ({
				invoices: [...state.invoices, ...newInvoices],
				lastDoc: snapshot.docs[snapshot.docs.length - 1] || null,
				hasMore: snapshot.docs.length === 10,
			}));
		} finally {
			set({ isLoading: false });
		}
	},

	updateInvoiceStatus: async (companyId, invoiceId, status) => {
		const invoiceRef = doc(db, `companies/${companyId}/invoices/${invoiceId}`);
		await updateDoc(invoiceRef, { status });

		set((state) => ({
			invoices: state.invoices.map((invoice) =>
				invoice.id === invoiceId ? { ...invoice, status } : invoice,
			),
		}));
	},

	reset: () => {
		const unsubscribed = get().unsubscribe;
		if (unsubscribed) {
			unsubscribed();
		}

		set({
			invoices: [],
			isLoading: false,
			hasMore: true,
			lastDoc: null,
			unsubscribe: null,
		});
	},
}));
