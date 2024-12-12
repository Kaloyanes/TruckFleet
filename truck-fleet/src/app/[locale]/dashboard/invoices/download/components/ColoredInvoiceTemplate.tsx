import type { Invoice } from "@/types/invoice";
import { format } from "date-fns";
import {
	Document,
	Page,
	Text,
	View,
	StyleSheet,
	Image,
} from "@react-pdf/renderer";

interface Props {
	invoice: Invoice;
}

const styles = StyleSheet.create({
	page: {
		padding: 30,
		backgroundColor: "white",
		fontSize: 14, // Base font size for the document
	},
	header: {
		flexDirection: "row",
		justifyContent: "space-between",
		backgroundColor: "#EBF5FF",
		padding: 20,
		borderTopLeftRadius: 8,
		borderTopRightRadius: 8,
	},
	logo: {
		width: 60,
		marginBottom: 10,
	},
	title: {
		fontSize: 24,
		fontWeight: "bold",
		color: "#1E40AF",
	},
	invoiceNumber: {
		fontSize: 16,
		color: "#4B5563",
	},
	dateSection: {
		textAlign: "right",
		fontSize: 14,
	},
	addresses: {
		flexDirection: "row",
		justifyContent: "space-between",
		padding: 20,
		backgroundColor: "#F9FAFB",
	},
	addressBlock: {
		width: "45%",
		fontSize: 12,
	},
	addressTitle: {
		fontSize: 14,
		fontWeight: "bold",
		marginBottom: 5,
		color: "#374151",
	},
	table: {
		marginTop: 20,
	},
	tableHeader: {
		flexDirection: "row",
		backgroundColor: "#DBEAFE",
		padding: 10,
		fontSize: 14,
	},
	tableRow: {
		flexDirection: "row",
		borderBottomWidth: 1,
		borderBottomColor: "#E5E7EB",
		padding: 10,
		fontSize: 14,
	},
	tableCell: {
		flex: 1,
	},
	tableCellRight: {
		flex: 1,
		textAlign: "right",
	},
	summary: {
		marginTop: 20,
		backgroundColor: "#EBF5FF",
		padding: 20,
		borderBottomLeftRadius: 8,
		borderBottomRightRadius: 8,
		fontSize: 14,
	},
	summaryRow: {
		flexDirection: "row",
		justifyContent: "space-between",
		marginBottom: 5,
	},
	footer: {
		marginTop: 30,
		fontSize: 14,
	},
	status: {
		textAlign: "center",
		marginTop: 20,
		fontWeight: "bold",
	},
	bankDetailsSection: {
		marginTop: 15,
		fontSize: 12,
	},
	bankDetailsTitle: {
		fontSize: 14,
		fontWeight: "bold",
		color: "#374151",
		marginBottom: 5,
	},
	dealDetailsSection: {
		marginTop: 15,
		fontSize: 12,
	},
	noteSection: {
		marginTop: 15,
		fontSize: 14,
	},
});

export default function ColoredInvoiceTemplate({ invoice }: Props) {
	return (
		<Document>
			<Page size="A4" style={styles.page}>
				{/* Header */}
				<View style={styles.header}>
					<View>
						{invoice.logo && <Image style={styles.logo} src={invoice.logo} />}
						<Text style={styles.title}>INVOICE</Text>
						<Text style={styles.invoiceNumber}>#{invoice.invoiceNumber}</Text>
					</View>
					<View style={styles.dateSection}>
						<Text>
							Issue Date: {format(invoice.issueDate, invoice.dateFormat)}
						</Text>
						<Text>Due Date: {format(invoice.dueDate, invoice.dateFormat)}</Text>
					</View>
				</View>

				{/* Addresses */}
				<View style={styles.addresses}>
					<View style={styles.addressBlock}>
						<Text style={styles.addressTitle}>From:</Text>
						<Text>{invoice.from.replaceAll("|", "\n")}</Text>
					</View>
					<View style={styles.addressBlock}>
						<Text style={styles.addressTitle}>To:</Text>
						<Text>{invoice.to.replaceAll("|", "\n")}</Text>
					</View>
				</View>

				{/* Items Table */}
				<View style={styles.table}>
					<View style={styles.tableHeader}>
						<Text style={styles.tableCell}>Description</Text>
						<Text style={styles.tableCellRight}>Quantity</Text>
						<Text style={styles.tableCellRight}>Price</Text>
						<Text style={styles.tableCellRight}>Total</Text>
					</View>
					{invoice.items.map((item) => (
						<View key={item.id} style={styles.tableRow}>
							<Text style={styles.tableCell}>{item.description}</Text>
							<Text style={styles.tableCellRight}>{item.quantity}</Text>
							<Text style={styles.tableCellRight}>
								{item.price.toLocaleString("en-US", {
									style: "currency",
									currency: invoice.currencyCode,
								})}
							</Text>
							<Text style={styles.tableCellRight}>
								{(item.quantity * item.price).toLocaleString("en-US", {
									style: "currency",
									currency: invoice.currencyCode,
								})}
							</Text>
						</View>
					))}
				</View>

				{/* Summary */}
				<View style={styles.summary}>
					<View style={styles.summaryRow}>
						<Text>Subtotal:</Text>
						<Text>
							{invoice.total.toLocaleString("en-US", {
								style: "currency",
								currency: invoice.currencyCode,
							})}
						</Text>
					</View>
					{invoice.discount && (
						<View style={styles.summaryRow}>
							<Text>Discount:</Text>
							<Text>-{invoice.discount}%</Text>
						</View>
					)}
					{invoice.vat && (
						<View style={styles.summaryRow}>
							<Text>VAT ({invoice.vat}%):</Text>
							<Text>
								{((invoice.total * invoice.vat) / 100).toLocaleString("en-US", {
									style: "currency",
									currency: invoice.currencyCode,
								})}
							</Text>
						</View>
					)}
					<View
						style={[styles.summaryRow, { borderTopWidth: 1, paddingTop: 5 }]}
					>
						<Text>Total:</Text>
						<Text>
							{invoice.total.toLocaleString("en-US", {
								style: "currency",
								currency: invoice.currencyCode,
							})}
						</Text>
					</View>
				</View>

				{/* Footer */}
				<View style={styles.footer}>
					<View style={styles.bankDetailsSection}>
						<Text style={styles.bankDetailsTitle}>Bank Details:</Text>
						<Text>{invoice.bankDetails.replaceAll("|", "\n")}</Text>
					</View>

					<View style={styles.dealDetailsSection}>
						<Text style={styles.bankDetailsTitle}>Deal Details:</Text>
						<Text>{invoice.dealDetails}</Text>
					</View>

					{invoice.note && (
						<View style={styles.noteSection}>
							<Text style={styles.addressTitle}>Note:</Text>
							<Text>{invoice.note}</Text>
						</View>
					)}
				</View>
			</Page>
		</Document>
	);
}
