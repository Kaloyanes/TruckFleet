import { InvoiceConverter } from "@/lib/converters/InvoiceConverter";
import { db } from "@/lib/Firebase";
import type { Invoice } from "@/types/invoice";
import { doc, getDoc } from "firebase/firestore";
import { type NextRequest, NextResponse } from "next/server";
import React from "react";
import ReactPDF, {
	pdf,
	renderToBuffer,
	renderToStream,
} from "@react-pdf/renderer";
import { MinimalInvoiceTemplate } from "./components/MinimalInvoiceTemplate";
import { useTranslations } from "next-intl";
import { getTranslations } from "next-intl/server";
import { useInvoiceOptionsStore } from "@/stores/Invoices/AddInvoiceOptionsStore";
import DetailedInvoiceTemplate from "./components/DetailedInvoiceTemplate";
import ColoredInvoiceTemplate from "./components/ColoredInvoiceTemplate";

export async function GET(request: NextRequest) {
	const params = request.nextUrl.searchParams;
	const id = params.get("id");
	const companyId = params.get("companyId");
	const template = params.get("template") ?? "minimal";

	if (!id || !companyId) {
		return Response.error();
	}

	const docData = await getDoc(
		doc(db, `companies/${companyId}/invoices/${id}`).withConverter(
			InvoiceConverter,
		),
	);

	const t = await getTranslations();

	const invoice = docData.data() as Invoice;

	const invoiceComponent = () => {
		switch (template) {
			case "detailed":
				return <DetailedInvoiceTemplate invoice={invoice} t={t as any} />;
			case "colored":
				return <ColoredInvoiceTemplate invoice={invoice} />;
			default:
				return <MinimalInvoiceTemplate invoice={invoice} t={t as any} />;
		}
	};

	const blob = await pdf(invoiceComponent()).toBlob();

	if (!blob) {
		return new NextResponse("Error", {
			status: 500,
		});
	}

	return new NextResponse(blob, {
		headers: {
			"Content-Type": "application/pdf",
			// "Content-Disposition": `attachment; filename=${invoice.invoiceNumber}.pdf`,
		},
	});
}
