import { setRequestLocale } from "next-intl/server";

export default async function GeminiPage(props: { params: Promise<{ locale: string }> }) {
    const params = await props.params;

    const {
        locale
    } = params;

    setRequestLocale(locale);

    return <h1>Welcome to Geminipage!</h1>;
}
