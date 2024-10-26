import { setRequestLocale } from "next-intl/server";

export default function GeminiPage({
	params: { locale },
}: { params: { locale: string } }) {
	setRequestLocale(locale);

	return <h1>Welcome to Geminipage!</h1>;
}
