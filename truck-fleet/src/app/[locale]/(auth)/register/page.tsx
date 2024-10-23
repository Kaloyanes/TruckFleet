import { unstable_setRequestLocale } from "next-intl/server";

export default async function RegisterPage(props: { params: Promise<{ locale: string }> }) {
    const params = await props.params;

    const {
        locale
    } = params;

    unstable_setRequestLocale(locale);

    return <h1>Welcome to Registerpage!</h1>;
}
