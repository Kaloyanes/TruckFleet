import {
  IconCalculator,
  IconCalendar,
  IconCurrencyDollar,
} from "@tabler/icons-react";
import { CurrencyCodeRecord } from "currency-codes-ts/dist/types";

export type ActionItem = {
  label: string;
  icon: typeof IconCalendar | typeof IconCurrencyDollar | typeof IconCalculator;
  items: (string | CurrencyCodeRecord)[];
};
