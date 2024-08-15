import type { Metadata } from "next";
import { Inter, Noto_Sans, Poppins } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import OrderSelectedContextProvider from "@/context/order-selected-context";
import { getMessages, unstable_setRequestLocale } from "next-intl/server";
import { NextIntlClientProvider } from "next-intl";
import { locales } from "@/lib/i18n";
import { ThemeProvider } from "@/context/theme-provider";

const inter = Inter({ subsets: ["latin"] });
const poppins = Poppins({
	preload: true,
	weight: ["400", "500", "600", "700", "800"],
	subsets: ["latin", "latin-ext"],
});

const noto = Noto_Sans({
	preload: true,
	weight: ["400", "500", "600", "700", "800"],
	subsets: ["cyrillic", "latin"],
});

export function generateStaticParams() {
	return locales.map((locale) => ({ locale }));
}

export const metadata: Metadata = {
	title: {
		template: "%s | Truck Fleet",
		default: "Truck Fleet",
	},

	description: "Generated by create next app",
};

export default async function RootLayout({
	children,
	params: { locale },
}: Readonly<{
	children: React.ReactNode;
	params: { locale: string };
}>) {
	unstable_setRequestLocale(locale);
	const messages = await getMessages();

	return (
		<html lang={locale} suppressHydrationWarning>
			<head>
				<meta charSet="utf-8" />
				<meta name="viewport" content="width=device-width, initial-scale=1" />
			</head>
			<body className={noto.className}>
				<ThemeProvider
					attribute="class"
					defaultTheme="system"
					enableSystem
					disableTransitionOnChange
				>
					<NextIntlClientProvider messages={messages}>
						<main>{children}</main>
						<Toaster />
					</NextIntlClientProvider>
				</ThemeProvider>
			</body>
		</html>
	);
}