import type { Customer } from "./client";

export type Driver = Customer & {
  companyId: string;
  photoUrl: string;
  type: "driver";
  location: object;
};
