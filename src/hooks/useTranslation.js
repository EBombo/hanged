import get from "lodash/get";
import { useCallback, useRef } from "reactn";
import { useRouter } from "next/router";
import styled from "styled-components";

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
    <StyledSwitch onClick={() => inputRef?.current?.click()}>
      <input
        ref={inputRef}
        id="language-toggle"
        className="check-toggle check-toggle-round-flat"
        type="checkbox"
        checked={locale === locales[1] ? true : false}
        onChange={(event) => {
          event.preventDefault();
          setLocale(event.target.checked ? locales[1] : locales[0]);
        }}
      />
      <label htmlFor="language-toggle" />
      <span className="on">EN</span>
      <span className="off">ES</span>
    </StyledSwitch>
  ), [locale]);

  return { t, locales, locale, setLocale, SwitchTranslation };
};

const StyledSwitch = styled.div`
  position: relative;
  display: inline-block;
  width: 50px;

  .on,
  .off {
    position: absolute;
    top: 5px;
    pointer-events: none;
    font-family: Lato;
    font-weight: bold;
    font-size: 12px;
    text-transform: uppercase;
    text-shadow: 0 1px 0 rgba(0, 0, 0, 0.06);
    width: 50%;
    text-align: center;
  }

  .check-toggle-round-flat:checked ~ {
    .off {
      color: ${(props) => props.theme.basic.primary};
    }

    .on {
      color: ${(props) => props.theme.basic.white};
    }
  }

  .on {
    left: 0;
    padding-left: 2px;
    color: ${(props) => props.theme.basic.primary};
  }

  .off {
    right: 0;
    padding-right: 4px;
    color: ${(props) => props.theme.basic.white};
  }

  .check-toggle {
    position: absolute;
    margin-left: -9999px;
    visibility: hidden;
  }

  .check-toggle + label {
    display: block;
    position: relative;
    cursor: pointer;
    outline: none;
  }

  .check-toggle-round-flat + label {
    padding: 2px;
    width: 50px;
    height: 25px;
    background-color: ${(props) => props.theme.basic.primary};
    border-radius: 60px;

    ::before,
    ::after {
      display: block;
      position: absolute;
      content: "";
    }

    ::before {
      top: 2px;
      left: 2px;
      bottom: 2px;
      right: 2px;
      background-color: ${(props) => props.theme.basic.primary};
      border-radius: 60px;
    }

    ::after {
      top: 2px;
      left: 2px;
      bottom: 2px;
      width: 25px;
      background-color: ${(props) => props.theme.basic.white};
      border-radius: 52px;
    }
  }

  .check-toggle-round-flat:checked + label:after {
    margin-right: 20px;
  }

  .check-toggle-round-flat:checked + label:after {
    margin-left: 20px;
  }
`;

// References:
// https://betterprogramming.pub/build-your-own-usetranslation-hook-with-next-js-2c65017d323a
// https://nextjs.org/docs/advanced-features/i18n-routing#limits-for-the-i18n-config
// https://github.com/a-chris/use-translation-example
