import React from "react";
import {
	Page,
	Text,
	View,
	Document,
	StyleSheet,
	Font,
	Image,
} from "@react-pdf/renderer";
import type { Invoice } from "@/types/invoice";
import { format } from "date-fns";

Font.register({
	family: "Manrope",
	fonts: [
		{
			src: "https://fonts.gstatic.com/s/manrope/v15/xn7_YHE41ni1AdIRqAuZuw1Bx9mbZk79FO_F87jxeN7B.ttf",
		},
		{
			src: "https://fonts.gstatic.com/s/manrope/v15/xn7_YHE41ni1AdIRqAuZuw1Bx9mbZk79FO_F87jxeN7B.ttf",
			fontWeight: 700,
		},
	],
	// src: "https://fonts.gstatic.com/s/manrope/v15/xn7_YHE41ni1AdIRqAuZuw1Bx9mbZk79FO_F87jxeN7B.ttf",
});

const styles = StyleSheet.create({
	page: {
		padding: 20,
		fontFamily: "Manrope",
		fontSize: 12,
		display: "flex",
		flexDirection: "column",
		gap: 20,
	},
});

export default function DetailedInvoiceTemplate({
	invoice,
	t,
}: {
	invoice: Invoice;
	t: (key: string) => string;
}) {
	const formatCurrency = (amount: number) => {
		return new Intl.NumberFormat("en-US", {
			style: "currency",
			currency: invoice.currencyCode,
		}).format(amount);
	};

	const subtotal = invoice.items.reduce(
		(sum, item) => sum + item.price * item.quantity,
		0,
	);
	const vatAmount = invoice.vat ? (subtotal * invoice.vat) / 100 : 0;
	const total = subtotal + vatAmount - (invoice.discount || 0);

	return (
		<Document>
			<Page size="A4" style={styles.page}>
				{/* From information and invoice title */}
				<View
					style={{
						display: "flex",
						flexDirection: "row",
						justifyContent: "space-between",
					}}
				>
					<View style={{ flex: 1, width: "50%" }}>
						{invoice.logo && (
							<Image
								style={{
									width: 75,
									height: 75,
									objectFit: "cover",
									marginBottom: 10,
									borderRadius: 8,
								}}
								src={invoice.logo}
							/>
						)}

						<View
							style={{
								display: "flex",
								flexDirection: "column",
							}}
						>
							<Text style={{ fontSize: 12, fontWeight: "bold" }}>
								{invoice.from.replaceAll("|", "\n")}
							</Text>
						</View>
					</View>
					<View
						style={{
							width: "50%",
							display: "flex",
							flexDirection: "column",
							alignItems: "flex-end",
						}}
					>
						<Text
							style={{
								fontSize: 30,
								fontWeight: 700,
								letterSpacing: 1.25,
							}}
						>
							INVOICE
						</Text>
						<Text
							style={{ fontSize: 15, fontWeight: "bold", color: "#5e5e5e" }}
						>
							{invoice.invoiceNumber}
						</Text>
					</View>
				</View>
				{/* To information and invoice details information */}
				<View
					style={{
						display: "flex",
						flexDirection: "row",
						justifyContent: "space-between",
					}}
				>
					<View
						style={{
							flex: 1,
						}}
					>
						<Text
							style={{
								fontSize: 12,
								fontWeight: "bold",
								color: "#5e5e5e",
							}}
						>
							To:
						</Text>
						<Text>{invoice.to.replaceAll("|", "\n")}</Text>
					</View>
					<View
						style={{
							flex: 1,
							display: "flex",
							flexDirection: "column",
							alignItems: "flex-end",
							gap: 10,
						}}
					>
						<View
							style={{
								display: "flex",
								flexDirection: "row",
								gap: 10,
								alignItems: "flex-end",
							}}
						>
							<Text
								style={{
									fontSize: 12,
									fontWeight: "bold",
									color: "#5e5e5e",
								}}
							>
								Issue Date:
							</Text>
							<Text>{format(invoice.issueDate, invoice.dateFormat)}</Text>
						</View>
						<View
							style={{
								display: "flex",
								flexDirection: "row",
								gap: 10,
								alignItems: "flex-end",
							}}
						>
							<Text
								style={{
									fontSize: 12,
									fontWeight: "bold",
									color: "#5e5e5e",
								}}
							>
								Due Date:
							</Text>
							<Text>{format(invoice.dueDate, invoice.dateFormat)}</Text>
						</View>
					</View>
				</View>
				{/* Items table */}
				{/* Header */}
				<View
					style={{
						flexDirection: "row",
						backgroundColor: "#131313",
						padding: 10,
						borderBottomWidth: 1,
						borderBottomColor: "#e0e0e0",
						borderTopWidth: 1,
						borderTopColor: "#e0e0e0",
						borderRadius: 8,
					}}
				>
					<Text
						style={{
							flex: 2,
							fontWeight: "bold",
							borderRightWidth: 1,
							borderRightColor: "#e0e0e0",
							paddingRight: 5,
							color: "#fff",
						}}
					>
						Item
					</Text>
					<Text
						style={{
							flex: 1,
							fontWeight: "bold",
							textAlign: "center",
							borderRightWidth: 1,
							borderRightColor: "#e0e0e0",
							paddingRight: 5,
							color: "#fff",
						}}
					>
						Quantity
					</Text>
					<Text
						style={{
							flex: 1,
							fontWeight: "bold",
							textAlign: "right",
							borderRightWidth: 1,
							borderRightColor: "#e0e0e0",
							paddingRight: 5,
							color: "#fff",
						}}
					>
						Price
					</Text>
					<Text
						style={{
							flex: 1,
							fontWeight: "bold",
							textAlign: "right",
							color: "#fff",
						}}
					>
						Total
					</Text>
				</View>

				{/* Items */}
				{invoice.items.map((item, index) => (
					<View
						key={index}
						style={{
							flexDirection: "row",
							padding: 10,
							borderBottomWidth: 1,
							borderBottomColor: "#e0e0e0",
						}}
					>
						<Text
							style={{
								flex: 2,
								borderRightWidth: 1,
								borderRightColor: "#e0e0e0",
								paddingRight: 5,
							}}
						>
							{item.description}
						</Text>
						<Text
							style={{
								flex: 1,
								textAlign: "center",
								borderRightWidth: 1,
								borderRightColor: "#e0e0e0",
								paddingRight: 5,
							}}
						>
							{item.quantity}
						</Text>
						<Text
							style={{
								flex: 1,
								textAlign: "right",
								borderRightWidth: 1,
								borderRightColor: "#e0e0e0",
								paddingRight: 5,
							}}
						>
							{formatCurrency(item.price)}
						</Text>
						<Text style={{ flex: 1, textAlign: "right" }}>
							{formatCurrency(item.price * item.quantity)}
						</Text>
					</View>
				))}

				{/* Summary */}
				<View style={{ marginTop: 20, alignItems: "flex-end" }}>
					<View style={{ width: "40%", gap: 5 }}>
						{(invoice.vat || invoice.discount) && (
							<View
								style={{
									flexDirection: "row",
									justifyContent: "space-between",
								}}
							>
								<Text>Subtotal:</Text>
								<Text>{formatCurrency(subtotal)}</Text>
							</View>
						)}
						{invoice.vat && invoice.vat > 0 && (
							<View
								style={{
									flexDirection: "row",
									justifyContent: "space-between",
								}}
							>
								<Text>VAT ({invoice.vat}%):</Text>
								<Text>{formatCurrency(vatAmount)}</Text>
							</View>
						)}
						{invoice.discount && invoice.discount > 0 && (
							<View
								style={{
									flexDirection: "row",
									justifyContent: "space-between",
								}}
							>
								<Text>Discount:</Text>
								<Text>-{formatCurrency(invoice.discount)}</Text>
							</View>
						)}
						<View
							style={{
								flexDirection: "row",
								justifyContent: "space-between",
								marginTop: 5,
								paddingTop: 5,
								borderTopWidth: 1,
								borderTopColor: "#e0e0e0",
							}}
						>
							<Text style={{ fontWeight: "bold" }}>Total:</Text>
							<Text style={{ fontWeight: "bold" }}>
								{formatCurrency(total)}
							</Text>
						</View>
					</View>
				</View>

				{/* Deal Details */}
				{invoice.dealDetails && invoice.dealDetails.trim() !== "" && (
					<View>
						<Text
							style={{ fontSize: 12, fontWeight: "bold", color: "#5e5e5e" }}
						>
							Deal Details:
						</Text>
						<Text>{invoice.dealDetails}</Text>
					</View>
				)}

				{/* Bank Details */}
				{invoice.bankDetails.trim() !== "" && (
					<View>
						<Text
							style={{ fontSize: 12, fontWeight: "bold", color: "#5e5e5e" }}
						>
							Bank Details:
						</Text>
						<Text>{invoice.bankDetails.replaceAll("|", "\n")}</Text>
					</View>
				)}

				{/* Note */}
				{invoice.note.trim() !== "" && (
					<View>
						<Text
							style={{ fontSize: 12, fontWeight: "bold", color: "#5e5e5e" }}
						>
							Note:
						</Text>
						<Text>{invoice.note}</Text>
					</View>
				)}
			</Page>
		</Document>
	);
}
