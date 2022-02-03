import React, { useEffect, useGlobal } from "reactn";
import "antd/dist/antd.css";
import "../src/theme/globals.css";
import { notification } from "antd";
import { useUser } from "../src/hooks";
import get from "lodash/get";
import { darkTheme, GlobalStyle, lightTheme } from "../src/theme";
import { ThemeProvider } from "styled-components";
import { ErrorBoundary } from "react-error-boundary";
import { ErrorFallback } from "../src/components/error-fallback/ErrorFallback";
import { WithAuthentication } from "../src/session/WithAuthentication";
import { WithConfiguration } from "../src/session/WithConfiguration";
import { config, firestoreEvents } from "../src/firebase";
import { snapshotToArray } from "../src/utils";
import Head from "next/head";
import Script from "next/script";

const MyApp = ({ Component, pageProps }) => {
  const [authUserLS] = useUser();
  const [, setAudios] = useGlobal("audios");

  useEffect(() => {
    const initialize = async () => {
      const audiosRef = await firestoreEvents.collection("audios").where("deleted", "==", false).get();

      setAudios(snapshotToArray(audiosRef));
    };

    initialize();
  }, []);

  const showNotificationAnt = (message, description, type = "error") => notification[type]({ message, description });

  return (
    <ThemeProvider theme={get(authUserLS, "theme") === "lightTheme" ? lightTheme : darkTheme}>
      <GlobalStyle />
      <Head>
        <title>Ahorcado</title>
        <meta charSet="UTF-8" />
        <meta name="google" value="notranslate" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1.0,user-scalable=0, shrink-to-fit=no"
        />
        <link rel="shortcut icon" href={`${config.storageUrl}/resources/icons/icon-72x72.png`} />
        <link rel="shortcut icon" href={`${config.storageUrl}/resources/icons/icon-512x512.png`} />
        <link rel="apple-touch-icon" sizes="180x180" href={`${config.storageUrl}/resources/icons/ios-icon-512x512.png`} />
        <link
          rel="apple-touch-icon-precomposed"
          sizes="144x144"
          href={`${config.storageUrl}/resources/icons/ios-icon-512x512.png`}
        />
        <link
          rel="apple-touch-icon-precomposed"
          sizes="114x114"
          href={`${config.storageUrl}/resources/icons/ios-icon-512x512.png`}
        />
        <link
          rel="apple-touch-icon-precomposed"
          sizes="72x72"
          href={`${config.storageUrl}/resources/icons/ios-icon-512x512.png`}
        />
        <link rel="apple-touch-icon-precomposed" href={`${config.storageUrl}/resources/icons/ios-icon-512x512.png`} />
        <meta property="og:image" content={`${config.storageUrl}/resources/icons/icon-512x512.png`} />
        <link rel="manifest" href={`${config.serverUrl}/api/manifest`} />
        <link href="https://fonts.googleapis.com/css2?family=Quicksand:wght@300&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Lato:wght@300&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Encode+Sans:wght@700&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Gloria+Hallelujah&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Lato:wght@700&display=swap" rel="stylesheet" />
      </Head>
      <Script
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
          (function(h,o,t,j,a,r){
              h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)};
              h._hjSettings={hjid:2724760,hjsv:6};
              a=o.getElementsByTagName('head')[0];
              r=o.createElement('script');r.async=1;
              r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv;
              a.appendChild(r);
          })(window,document,'https://static.hotjar.com/c/hotjar-','.js?sv=');
          `,
        }}
      />
      <ErrorBoundary FallbackComponent={ErrorFallback}>
        <WithConfiguration>
          <WithAuthentication>
            <Component {...pageProps} showNotification={showNotificationAnt} />
          </WithAuthentication>
        </WithConfiguration>
      </ErrorBoundary>
    </ThemeProvider>
  );
};

export default MyApp;
