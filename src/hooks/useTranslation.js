import get from "lodash/get";
import { useCallback } from "reactn";
import { useRouter } from "next/router";

import en from "../../public/locales/en.json";
import es from "../../public/locales/es.json";

// TODO: Consider chunk the json files.
const TRANSLATIONS = {
  en: { ...en },
  es: { ...es },
};

// TODO: Support capitalize.
export const useTranslation = (path) => {
  const router = useRouter();
  const { locale, asPath } = router;

  // Current languages.
  const locales = Object.keys(TRANSLATIONS);

  // Update language and redirect.
  const setLocale = useCallback(
    (locale) => {
      router.push(asPath, asPath, { locale });
    },
    [asPath, router, locale]
  );

  // You can use:
  // t("landing.title"); OR const {t} = useTranslation("landing");
  // You can define a default value: t("landing.title","defaultValue");
  const t = useCallback(
    (keyString, defaultValue = "") => {
      const route = path ? `${path}.` : "";

      return get(TRANSLATIONS[locale], `${route}${keyString}`, defaultValue ?? keyString);
    },
    [TRANSLATIONS, locale, path]
  );

  return { t, locales, locale, setLocale };
};

// References:
// https://betterprogramming.pub/build-your-own-usetranslation-hook-with-next-js-2c65017d323a
// https://nextjs.org/docs/advanced-features/i18n-routing#limits-for-the-i18n-config
// https://github.com/a-chris/use-translation-example
