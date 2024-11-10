import {
  IconCalculator,
  IconCalendar,
  IconCurrencyDollar,
} from "@tabler/icons-react";
import { format } from "date-fns";
import type { ActionItem } from "./types";

const date = new Date();

export const INVOICE_ACTIONS: ActionItem[] = [
  {
    label: "Date Format",
    icon: IconCalendar,
    items: [
      format(date, "dd/MM/yyyy"),
      format(date, "MM/dd/yyyy"),
      format(date, "yyyy/MM/dd"),
    ],
  },
  {
    label: "Sales Tax",
    icon: IconCalendar,
    items: ["Yes", "No"],
  },
  {
    label: "Currency",
    icon: IconCurrencyDollar,
    items: [], // Will be populated in component
  },
  {
    label: "VAT",
    icon: IconCalculator,
    items: ["Yes", "No"],
  },
];
