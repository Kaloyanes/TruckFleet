export type Truck = {
  id: string;
  capacity: number;
  licensePlate: string;
  model: string;
  status: "On Route" | "Available" | "In Repair";
  year: number;
  createdAt: Date;
};
