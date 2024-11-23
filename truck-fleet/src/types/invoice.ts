export type InvoiceItem = {
  id: string;
  description: string;
  quantity: number;
  price: number;
};

export type Invoice = {
  id: string;
  invoiceNumber: string;
  issueDate: Date;
  dueDate: Date;
  from: string;
  to: string;
  items: InvoiceItem[];
  logo?: string;
  vat?: number;
  bankDetails: string;
  note: string;
  discount?: number;
  dealDetails: string;
  createdAt: Date;
  status: "pending" | "paid" | "overdue" | "cancelled";
  total: number;
};
