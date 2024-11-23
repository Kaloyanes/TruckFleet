import type {
  IconCalculator,
  IconCalendar,
  IconCurrencyDollar,
} from "@tabler/icons-react";
import type { CurrencyCodeRecord } from "currency-codes-ts/dist/types";

export type ActionItem = {
  label: string;
  icon: typeof IconCalendar | typeof IconCurrencyDollar | typeof IconCalculator;
  items: (string | CurrencyCodeRecord)[];
};
