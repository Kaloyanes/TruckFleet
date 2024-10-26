import { setRequestLocale, unstable_setRequestLocale } from "next-intl/server";

export default async function RegisterPage({
	params: { locale },
}: { params: { locale: string } }) {
	setRequestLocale(locale);

	return <h1>Welcome to Registerpage!</h1>;
}
