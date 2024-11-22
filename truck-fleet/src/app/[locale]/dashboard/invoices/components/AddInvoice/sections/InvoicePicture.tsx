import { Spinner } from "@/components/ui/loading-spinner";
import useCompanyId from "@/hooks/useCompanyId";
import { useInvoiceValuesStore } from "@/stores/Invoices/InvoiceValuesStore";
import { IconPlus, IconTrash } from "@tabler/icons-react";
import Image from "next/image";
import { useEffect } from "react";
import { useFilePicker } from "use-file-picker";

export default function InvoicePicture() {
  const invoice = useInvoiceValuesStore();
  const { companyId } = useCompanyId();
  const { openFilePicker, plainFiles, loading } = useFilePicker({
    accept: ["image/*"],
    readAs: "DataURL",
  });

  useEffect(() => {
    if (plainFiles.length > 0 && companyId) {
      invoice.setLogo(plainFiles[0], companyId);
    }
  }, [plainFiles, companyId, invoice.setLogo]);

  if (loading || !companyId) return <Spinner />;

  return (
    <div className="flex flex-row items-center justify-between">
      <div className="group relative aspect-square h-[75px] w-[75px]">
        {invoice.logo && companyId ? (
          <Image
            className="aspect-square rounded-lg object-cover "
            src={invoice.logo.link}
            width={75}
            height={75}
            alt="Invoice Logo, Company Logo"
          />
        ) : (
          <div className="flex aspect-square items-center justify-center rounded-lg bg-dot-white" />
        )}
        {!invoice.logo ? (
          <div
            onClick={openFilePicker}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                openFilePicker();
              }
            }}
            className="absolute top-0 flex h-full w-full cursor-pointer items-center justify-center rounded-lg bg-transparent opacity-0 transition-all ease-out-cubic group-hover:bg-black/50 group-hover:opacity-100"
          >
            <IconPlus className="size-9 opacity-100" />
          </div>
        ) : (
          <div
            onClick={() => {
              invoice.removeLogo(companyId);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                invoice.removeLogo(companyId);
              }
            }}
            className="absolute top-0 flex h-full w-full cursor-pointer items-center justify-center rounded-lg bg-transparent opacity-0 transition-all ease-out-cubic group-hover:bg-black/50 group-hover:opacity-100"
          >
            <IconTrash className="size-9 opacity-100" />
          </div>
        )}
      </div>
    </div>
  );
}
