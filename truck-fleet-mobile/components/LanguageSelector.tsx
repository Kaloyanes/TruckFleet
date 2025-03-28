import * as React from "react";
import { Button } from "~/components/ui/button";

import * as DropdownMenu from "zeego/dropdown-menu";
import i18n, { changeLanguage } from "~/locales/i18n";
import { Languages } from "lib/icons/Language";

export default function LanguageSelector() {
  const languages = [
    {
      code: "en",
      name: "English",
    },
    {
      code: "bg",
      name: "Bulgarian",
    },
  ];

  return (
    <DropdownMenu.Root modal>
      <DropdownMenu.Trigger asChild>
        <Button variant="outline" size={"icon"} style={{ padding: 10 }}>
          <Languages
            className="text-foreground "
            size={20}
            strokeWidth={1.25}
          />
        </Button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content className="w-64 native:w-72">
        {languages.map((language) => (
          <DropdownMenu.CheckboxItem
            value={language.code === i18n.language}
            key={language.code}
            onSelect={() => changeLanguage(language.code)}
          >
            <DropdownMenu.ItemTitle>{language.name}</DropdownMenu.ItemTitle>
          </DropdownMenu.CheckboxItem>
        ))}
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );
}
