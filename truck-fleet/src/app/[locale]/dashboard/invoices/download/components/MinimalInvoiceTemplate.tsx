import React from "react";
import {
	Page,
	Text,
	View,
	Document,
	StyleSheet,
	Image,
	Font,
} from "@react-pdf/renderer";
import type { Invoice } from "@/types/invoice";
import { format } from "date-fns";
import { useTranslations } from "next-intl";
import { convert } from "@/lib/utils";
import type { InvoiceOptions } from "@/stores/Invoices/AddInvoiceOptionsStore";
Font.register({
	family: "Manrope",
	src: "https://fonts.gstatic.com/s/manrope/v15/xn7_YHE41ni1AdIRqAuZuw1Bx9mbZk79FO_F87jxeN7B.ttf",
});

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
	src: "https://fonts.gstatic.com/s/manrope/v15/xn7_YHE41ni1AdIRqAuZuw1Bx9mbZk79FO_F87jxeN7B.ttf",
});

const styles = StyleSheet.create({
	page: {
		padding: 20,
		fontFamily: "Manrope",
	},
	header: {
		flexDirection: "row",
		marginBottom: 30,
		alignItems: "center",
	},
	logo: {
		width: 75,
		height: 75,
		borderRadius: 8,
	},
	invoiceInfo: {
		flexDirection: "row",
		justifyContent: "space-between",
		marginBottom: 30,
	},
	infoSection: {
		flex: 1,
		maxWidth: "45%", // Limit width to prevent overflow
	},
	label: {
		fontSize: 12,
		color: "#666",
		marginBottom: 4,
	},
	value: {
		fontSize: 12,
		lineHeight: 1.2,
	},
	addressSection: {
		flexDirection: "row",
		justifyContent: "space-between",
		marginBottom: 100,
		gap: 20, // Add gap between sections
	},
	address: {
		flex: 1,
		fontSize: 12,
		whiteSpace: "pre-wrap",
		wordWrap: "break-word", // Ensure long words break
		lineHeight: 1.2,
	},
	itemsHeader: {
		flexDirection: "row",
		borderBottomWidth: 1,
		borderBottomColor: "#666",
		paddingBottom: 8,
		marginBottom: 10,
	},
	itemsTable: {
		marginBottom: 30,
		flex: 1,
	},
	itemRow: {
		flexDirection: "row",
		padding: 8,
		backgroundColor: "#f5f5f5",
	},
	descriptionCol: {
		flex: 5,
		fontSize: 12,
	},
	quantityCol: {
		flex: 2,
		fontSize: 12,
		textAlign: "center",
		textTransform: "capitalize",
	},
	priceCol: {
		flex: 4,
		fontSize: 12,
		textAlign: "right",
		textTransform: "capitalize",
	},
	totalCol: {
		flex: 3,
		fontSize: 12,
		textAlign: "right",
		textTransform: "capitalize",
	},
	totalsSection: {
		// marginLeft: "55.35%",
		marginBottom: 30,
	},
	totalRow: {
		flexDirection: "row",
		justifyContent: "space-between",
		paddingVertical: 4,
	},
	totalSplit: {
		display: "flex",
		flexDirection: "row",
	},
	finalTotal: {
		borderTopWidth: 1,
		borderTopColor: "#666",
		marginTop: 8,
		paddingTop: 8,
	},
	footer: {
		display: "flex",
		flexDirection: "row",
	},
	footerSection: {
		flex: 1,
		fontSize: 12,
		whiteSpace: "pre-wrap",
	},
	dealDetails: {
		fontSize: 12,
		marginTop: 20,
		// padding: 10,
		paddingBottom: 20,
	},
});

export const MinimalInvoiceTemplate = ({
	invoice,
	t,
}: {
	invoice: Invoice;
	t: (key: string) => string;
}) => {
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
				{/* Header with Logo */}
				<View style={styles.header}>
					{invoice.logo && <Image style={styles.logo} src={invoice.logo} />}
				</View>

				{/* Invoice Info */}
				<View style={styles.invoiceInfo}>
					<View style={styles.infoSection}>
						<Text style={styles.label}>Invoice Number</Text>
						<Text style={styles.value}>{invoice.invoiceNumber}</Text>
					</View>
					<View style={styles.infoSection}>
						<Text style={styles.label}>Issue Date</Text>
						<Text style={styles.value}>
							{format(invoice.issueDate, invoice.dateFormat)}
						</Text>
					</View>
					<View style={styles.infoSection}>
						<Text style={styles.label}>Due Date</Text>
						<Text style={styles.value}>
							{format(invoice.dueDate, invoice.dateFormat)}
						</Text>
					</View>
				</View>

				{/* From/To Addresses */}
				<View style={styles.addressSection}>
					<View style={styles.infoSection}>
						<Text style={styles.label}>From:</Text>
						<Text style={styles.address}>
							{invoice.from.split("|").join("\n")}
						</Text>
					</View>
					<View style={styles.infoSection}>
						<Text style={styles.label}>To:</Text>
						<Text style={styles.address}>
							{invoice.to.split("|").join("\n")}
						</Text>
					</View>
				</View>

				{/* Deal Details */}
				{invoice.dealDetails && (
					<View style={styles.dealDetails}>
						<Text style={styles.label}>Deal Details:</Text>
						<Text style={styles.value}>{invoice.dealDetails}</Text>
					</View>
				)}

				{/* Items Table */}
				<View style={styles.itemsTable}>
					<View style={styles.itemsHeader}>
						<Text style={[styles.descriptionCol, styles.label]}>
							Description
						</Text>
						<Text style={[styles.quantityCol, styles.label]}>Quantity</Text>
						<Text style={[styles.priceCol, styles.label]}>Price</Text>
						<Text style={[styles.totalCol, styles.label]}>Total</Text>
					</View>

					<View style={{ overflow: "hidden", borderRadius: 8 }}>
						{invoice.items.map((item, index) => (
							<View key={item.id} style={styles.itemRow}>
								<Text style={styles.descriptionCol}>{item.description}</Text>
								<View
									style={[
										styles.quantityCol,
										{ display: "flex", flexDirection: "column", gap: 10 },
									]}
								>
									<Text style={styles.quantityCol}>{item.quantity}</Text>
								</View>
								<View
									style={[
										styles.priceCol,
										{ display: "flex", flexDirection: "column", gap: 10 },
									]}
								>
									<Text style={styles.priceCol}>
										{formatCurrency(item.price)}
									</Text>
								</View>
								<View
									style={[
										styles.totalCol,
										{ display: "flex", flexDirection: "column", gap: 10 },
									]}
								>
									<Text style={[styles.totalCol, { fontWeight: "bold" }]}>
										{formatCurrency(item.price * item.quantity)}
									</Text>
								</View>
							</View>
						))}
					</View>
				</View>

				{/* Totals */}
				<View style={styles.footer}>
					<View style={styles.footerSection} />
					<View style={[styles.totalsSection, styles.footerSection]}>
						<View style={styles.totalRow}>
							<Text style={styles.label}>Subtotal:</Text>
							<View
								style={{
									display: "flex",
									flexDirection: "column",
									gap: 10,
									alignItems: "flex-end",
								}}
							>
								<Text style={styles.value}>{formatCurrency(subtotal)}</Text>
							</View>
						</View>
						{invoice.vat && invoice.vat > 0 && (
							<View style={styles.totalRow}>
								<Text style={styles.label}>VAT ({invoice.vat}%):</Text>
								<View
									style={{
										display: "flex",
										flexDirection: "column",
										gap: 10,
										alignItems: "flex-end",
									}}
								>
									<Text style={styles.value}>{formatCurrency(vatAmount)}</Text>
								</View>
							</View>
						)}
						{invoice.discount && invoice.discount > 0 && (
							<View style={styles.totalRow}>
								<Text style={styles.label}>Discount:</Text>
								<View
									style={{
										display: "flex",
										flexDirection: "column",
										gap: 10,
										alignItems: "flex-end",
									}}
								>
									<Text style={styles.value}>
										-{formatCurrency(invoice.discount)}
									</Text>
								</View>
							</View>
						)}
						<View style={[styles.totalRow, styles.finalTotal]}>
							<Text style={[styles.label, { fontSize: 15 }]}>Total:</Text>
							<View
								style={{
									display: "flex",
									flexDirection: "column",
									gap: 10,
									alignItems: "flex-end",
								}}
							>
								<Text
									style={[styles.value, { fontSize: 25, fontWeight: "bold" }]}
								>
									{formatCurrency(total)}
								</Text>
								<Text
									style={[
										styles.value,
										{ textTransform: "capitalize", fontWeight: "extrabold" },
									]}
								>
									{convert(total, t)}
								</Text>
							</View>
						</View>
					</View>
				</View>

				{/* Footer */}
				<View style={styles.footer}>
					<View style={styles.footerSection}>
						<Text style={styles.label}>Bank Details:</Text>
						<Text style={styles.value}>
							{invoice.bankDetails.split("|").join("\n")}
						</Text>
					</View>
					<View style={styles.footerSection}>
						<Text style={styles.label}>Notes:</Text>
						<Text style={styles.value}>{invoice.note}</Text>
					</View>
				</View>
			</Page>
		</Document>
	);
};
