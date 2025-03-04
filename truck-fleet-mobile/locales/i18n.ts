import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import * as Localization from "expo-localization";
import AsyncStorage from "@react-native-async-storage/async-storage";
import bg from "./bg.json";
import en from "./en.json";
import { MMKV } from "react-native-mmkv";

const resources = {
  bg: { translation: bg },
  en: { translation: en },
};

const mmkv = new MMKV({
  id: "kaloyanes.language",
});

const initI18n = async () => {
  let savedLanguage = await AsyncStorage.getItem("language");

  if (!savedLanguage) {
    savedLanguage = Localization.getLocales()[0].languageCode;
  }

  i18n.use(initReactI18next).init({
    compatibilityJSON: "v4",
    resources,
    lng: savedLanguage ?? undefined,
    fallbackLng: "en",
    interpolation: {
      escapeValue: false,
    },
  });
};

export async function changeLanguage(language: string) {
  await mmkv.set("language", language);
  i18n.changeLanguage(language);
}

initI18n();

export default i18n;
