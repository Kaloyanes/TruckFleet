import { create } from "zustand";
import { z } from "zod";

export const truckFormSchema = z.object({
  licensePlate: z.string().min(1, "License plate is required"),
  model: z.string().min(1, "Model is required"),
  capacity: z.number().min(1, "Capacity higher than 0"),
  status: z.string().min(1, "Status is required"),
  year: z.number().min(1900, "Year must be after 1900"),
  createdAt: z.date().nullable(),
});

interface TruckFormState {
  id?: string;
  licensePlate: string;
  model: string;
  capacity: number;
  status: string;
  year: number;
  createdAt: Date | null;
  setField: (
    field: keyof Omit<
      TruckFormState,
      "setField" | "populate" | "reset" | "validate"
    >,
    value: any,
  ) => void;
  populate: (
    data: Partial<
      Omit<TruckFormState, "setField" | "populate" | "reset" | "validate">
    >,
  ) => void;
  reset: () => void;
  validate: () => ReturnType<typeof truckFormSchema.safeParse>;
}

const useTruckFormStore = create<TruckFormState>((set, get) => ({
  id: undefined,
  licensePlate: "",
  model: "",
  capacity: 0,
  status: "",
  year: new Date().getFullYear(),
  createdAt: null,
  setField: (field, value) => set(() => ({ [field]: value })),
  populate: (data) => set(() => ({ ...data })),
  reset: () =>
    set({
      id: undefined,
      licensePlate: "",
      model: "",
      capacity: 0,
      status: "",
      year: new Date().getFullYear(),
      createdAt: null,
    }),
  validate: () =>
    truckFormSchema.safeParse({
      licensePlate: get().licensePlate,
      model: get().model,
      capacity: get().capacity,
      status: get().status,
      year: get().year,
      createdAt: get().createdAt,
    }),
}));

export default useTruckFormStore;
