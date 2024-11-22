import { db, storage } from "@/lib/firebase";
import { addDoc, collection, doc, getDoc } from "firebase/firestore";
import {
  type StorageReference,
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
}

interface InvoiceValuesStore {
  invoiceNumber: string;
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
  createInvoice: (companyId: string | null) => Promise<void>;
}

const defaultValues = {
  invoiceNumber: "INV-0001",
  issueDate: new Date(),
  dueDate: new Date(),
  from: "",
  to: "",
  items: [
    { id: uuidv4(), description: "", quantity: 0, price: 0 },
  ] as InvoiceItem[],
  vat: undefined,
  bankDetails: "",
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
      reset: () => set({ ...defaultValues, openSheet: true }),
      load: async (companyId) => {
        set({ isLoading: true });
        // Load data
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

          set({
            from: `${profile.name}\n${profile.address}\n${profile.country}\n${profile.phone}\n${profile.ownerEmail}\n${profile.vatNumber}`,
            bankDetails: `${profile.bank}\n${profile.iban}\n${profile.bankCode}`,
          });
        }

        set({ isLoading: false, openSheet: false });
      },
      createInvoice: async (companyId) => {
        if (!companyId) return;

        const state = get();
        const invoiceData = {
          invoiceNumber: state.invoiceNumber,
          issueDate: state.issueDate,
          dueDate: state.dueDate,
          from: state.from,
          to: state.to,
          items: state.items,
          logo: state.logo?.link, // Only store the URL
          vat: state.vat,
          bankDetails: state.bankDetails,
          note: state.note,
          discount: state.discount,
          dealDetails: state.dealDetails,
          createdAt: new Date(),
          status: "pending",
        };

        const invoicesRef = collection(db, `companies/${companyId}/invoices`);
        await addDoc(invoicesRef, invoiceData);

        // Reset the store after successful creation
        get().reset();
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
