import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

type InvoiceOptions = {
	dateFormat: string;
	currency: {
		code: string;
		currency: string;
	} | null;
	salesTax: boolean;
	vat: boolean;
	vatNumbers: boolean;
	discount: boolean;
	decimals: boolean;
};

type InvoiceOptionsStore = {
	options: InvoiceOptions;
	setDateFormat: (format: string) => void;
	setCurrency: (currency: { code: string; currency: string } | null) => void;
	setSalesTax: (enabled: boolean) => void;
	setVat: (enabled: boolean) => void;
	setVatNumbers: (enabled: boolean) => void;
	setDiscount: (enabled: boolean) => void;
	setDecimals: (enabled: boolean) => void;
	resetOptions: () => void;
};

const defaultOptions: InvoiceOptions = {
	dateFormat: "dd/MM/yyyy",
	currency: null,
	salesTax: false,
	vat: false,
	vatNumbers: false,
	discount: false,
	decimals: false,
};

export const useInvoiceOptionsStore = create<InvoiceOptionsStore>()(
	persist<InvoiceOptionsStore>(
		(set, get) => ({
			options: { ...defaultOptions },
			setDateFormat: (format) =>
				set((state) => ({
					options: { ...state.options, dateFormat: format },
				})),
			setCurrency: (currency) =>
				set((state) => ({
					options: { ...state.options, currency },
				})),
			setSalesTax: (enabled) =>
				set((state) => ({
					options: { ...state.options, salesTax: enabled },
				})),
			setVat: (enabled) =>
				set((state) => ({
					options: { ...state.options, vat: enabled },
				})),
			setVatNumbers: (enabled) =>
				set((state) => ({
					options: { ...state.options, vatNumbers: enabled },
				})),
			setDiscount: (enabled) =>
				set((state) => ({
					options: { ...state.options, discount: enabled },
				})),
			setDecimals: (enabled) =>
				set((state) => ({
					options: { ...state.options, decimals: enabled },
				})),
			resetOptions: () => set({ options: defaultOptions }),
		}),
		{
			name: "invoice-options",
		},
	),
);
