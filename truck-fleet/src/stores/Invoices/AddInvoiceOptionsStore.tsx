import type { Format } from "@number-flow/react";
import { create } from "zustand";
import { persist } from "zustand/middleware";

export type InvoiceOptions = {
	dateFormat: string;
	currency: {
		code: string;
		currency: string;
	};
	salesTax: boolean;
	vat: boolean;
	vatNumbers: boolean;
	discount: boolean;
	decimals: boolean;
	showDealDetails: boolean;
	showNumberInWords: boolean;
};

type InvoiceOptionsStore = {
	options: InvoiceOptions;
	getCurrencyFormat: () => Partial<Format>;
	setDateFormat: (format: string) => void;
	setCurrency: (currency: { code: string; currency: string }) => void;
	setSalesTax: (enabled: boolean) => void;
	setVat: (enabled: boolean) => void;
	setVatNumbers: (enabled: boolean) => void;
	setDiscount: (enabled: boolean) => void;
	setDecimals: (enabled: boolean) => void;
	resetOptions: () => void;
	update: (update: Partial<InvoiceOptions>) => void;
};

const defaultOptions: InvoiceOptions = {
	dateFormat: "dd/MM/yyyy",
	currency: {
		code: "USD",
		currency: "US Dollar",
	},
	salesTax: false,
	vat: false,
	vatNumbers: false,
	discount: false,
	decimals: false,
	showDealDetails: false,
	showNumberInWords: true,
};

export const useInvoiceOptionsStore = create<InvoiceOptionsStore>()(
	persist<InvoiceOptionsStore>(
		(set, get) => ({
			options: defaultOptions,
			getCurrencyFormat: () => ({
				currency: get().options.currency.code,
				currencyDisplay: "symbol",
				style: "currency",
				roundingMode: "ceil",
				roundingIncrement: get().options.decimals ? 1 : 100,
				trailingZeroDisplay: get().options.decimals ? "auto" : "stripIfInteger",
			}),
			update: (update) =>
				set((state) => ({ options: { ...state.options, ...update } })),
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
