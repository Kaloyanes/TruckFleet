import { setRequestLocale, unstable_setRequestLocale } from "next-intl/server";

export default async function ProfileLayout(props: { params: Promise<{ locale: string }>; children: React.ReactNode }) {
    const params = await props.params;

    const {
        locale
    } = params;

    const {
        children
    } = props;

    setRequestLocale(locale);
    return <section>{children}</section>;
}
