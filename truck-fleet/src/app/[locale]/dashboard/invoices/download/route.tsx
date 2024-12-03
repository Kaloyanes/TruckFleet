import { invoiceConverter } from "@/lib/converters/invoiceConverter";
import { db } from "@/lib/firebase";
import type { Invoice } from "@/types/invoice";
import { doc, getDoc } from "firebase/firestore";
import { NextResponse } from "next/server";
import React from "react";
import ReactPDF from "@react-pdf/renderer";
import { MyDocument } from "./components/InvoiceTemplate";

export async function GET(request: Request) {
	const params = new URL(request.url).searchParams;
	const id = params.get("id");
	const companyId = params.get("companyId");

	if (!id || !companyId) {
		return Response.error();
	}

	// const docData = await getDoc(
	// 	doc(db, `companies/${companyId}/invoices/${id}`).withConverter(
	// 		invoiceConverter,
	// 	),
	// );
	// const invoice = docData.data() as Invoice;
	const PDFDocument = require("pdfkit");
	const doc = PDFDocument.createDocument();

	// return new NextResponse(buffer as any, {
	// 	headers: {
	// 		"Content-Type": "application/pdf",
	// 		"Content-Disposition": `attachment; filename=invoice-${id}.pdf`,
	// 	},
	// });
}
