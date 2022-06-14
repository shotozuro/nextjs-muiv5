import * as React from "react";
import App from "next/app";
import PropTypes from "prop-types";
import Head from "next/head";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { CacheProvider } from "@emotion/react";
import theme from "../src/theme";
import createEmotionCache from "../src/createEmotionCache";

// Client-side cache, shared for the whole session of the user in the browser.

export default function MyApp(props) {
  const { Component, nonce, pageProps } = props;
  const emotionCache = createEmotionCache(nonce);
  return (
    <CacheProvider value={emotionCache}>
      <Head nonce={nonce}>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
      </Head>
      <ThemeProvider theme={theme}>
        {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
        <CssBaseline />
        <Component {...pageProps} />
      </ThemeProvider>
    </CacheProvider>
  );
}

MyApp.getInitialProps = async (appContext) => {
  const {
    ctx: { req, res },
  } = appContext;
  // calls page's `getInitialProps` and fills `appProps.pageProps`
  const appProps = await App.getInitialProps(appContext);

  const nonce =
    typeof window === "undefined"
      ? res?.locals?.cspNonce
      : window.__webpack_nonce__;

  return {
    ...appProps,
    nonce,
  };
};

MyApp.propTypes = {
  Component: PropTypes.elementType.isRequired,
  pageProps: PropTypes.object.isRequired,
};
