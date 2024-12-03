import { invoiceConverter } from "@/lib/converters/invoiceConverter";
import { db } from "@/lib/firebase";
import type { Invoice } from "@/types/invoice";
import { doc, getDoc } from "firebase/firestore";
import { type NextRequest, NextResponse } from "next/server";
import React from "react";
import ReactPDF, {
	pdf,
	renderToBuffer,
	renderToStream,
} from "@react-pdf/renderer";
import { MyDocument } from "./components/InvoiceTemplate";

export async function GET(request: NextRequest) {
	const params = request.nextUrl.searchParams;
	const id = params.get("id");
	const companyId = params.get("companyId");

	if (!id || !companyId) {
		return Response.error();
	}

	const docData = await getDoc(
		doc(db, `companies/${companyId}/invoices/${id}`).withConverter(
			invoiceConverter,
		),
	);
	const invoice = docData.data() as Invoice;
	const blob = await pdf(<MyDocument invoice={invoice} />).toBlob();

	if (!blob) {
		return new NextResponse("Error", {
			status: 500,
		});
	}

	return new NextResponse(blob, {
		headers: {
			"Content-Type": "application/pdf",
			// "Content-Disposition": `attachment; filename=invoice-${id}.pdf`,
		},
	});
}
