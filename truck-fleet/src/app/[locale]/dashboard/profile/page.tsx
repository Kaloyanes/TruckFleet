import { unstable_setRequestLocale } from "next-intl/server";

export default function ProfilePage({
	params: { locale },
}: { params: { locale: string } }) {
	unstable_setRequestLocale(locale);

	return <h1>Welcome to ProfilePagepage!</h1>;
}
