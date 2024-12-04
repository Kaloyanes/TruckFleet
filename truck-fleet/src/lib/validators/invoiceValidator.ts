import { z } from "zod";

export const invoiceItemSchema = z.object({
  id: z.string(),
  description: z.string().min(1, "Description is required"),
  quantity: z.number().min(0.01, "Quantity must be greater than 0"),
  price: z.number().min(0.01, "Price must be greater than 0"),
});

export const invoiceSchema = z.object({
  invoiceNumber: z.string().min(1, "Invoice number is required"),
  issueDate: z.date(),
  dueDate: z.date(),
  from: z.string().min(1, "Sender details are required"),
  to: z.string().min(1, "Recipient details are required"),
  items: z.array(invoiceItemSchema).min(1, "At least one item is required"),
  bankDetails: z.string().min(1, "Bank details are required"),
  vat: z.number().optional(),
  note: z.string().optional(),
  discount: z.number().optional(),
  dealDetails: z.string().optional(),
});

export type InvoiceValidation = z.infer<typeof invoiceSchema>;
