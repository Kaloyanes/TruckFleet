import type { Customer } from "./customer";

export type Driver = Customer & {
  companyId: string;
  photoUrl: string;
  type: "driver";
  location: object;
};
