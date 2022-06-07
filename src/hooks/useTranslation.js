import get from "lodash/get";
import { useCallback, useRef } from "reactn";
import { useRouter } from "next/router";
import { Switch } from "../components/form/Switch";

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

  const inputRef = useRef(null);

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

  const SwitchTranslation = useCallback(() => (
    <Switch
      size="small"
      variant="switcher"
      label1="En"
      label2="Es"
      defaultChecked={locale === locales[1]}
      onChange={(event) => {
        event.preventDefault();
        setLocale(event.target.checked ? locales[1] : locales[0]);
      }}
    />
  ), [locale]);

  return { t, locales, locale, setLocale, SwitchTranslation };
};

// References:
// https://betterprogramming.pub/build-your-own-usetranslation-hook-with-next-js-2c65017d323a
// https://nextjs.org/docs/advanced-features/i18n-routing#limits-for-the-i18n-config
// https://github.com/a-chris/use-translation-example
