import React, { Component, memo } from "react";
import "bootstrap-css-only/css/bootstrap.min.css";
import "mdbreact/dist/css/mdb.css";
import Layout from "../components/Layout";
import { AnimatePresence } from "framer-motion";
import "../styles/globals.css";
import "../css/customcss.css";
import "@fortawesome/fontawesome-svg-core/styles.css"; // import Font Awesome CSS
import { config } from "@fortawesome/fontawesome-svg-core";
import "../components/Marquee.scss";
import { SessionProvider } from "next-auth/react";

config.autoAddCss = false;

import PropTypes from "prop-types";

function App({ Component, pageProps: { session, ...pageProps } }) {
  return (
    <SessionProvider session={pageProps.session}>
      <Layout>
        <AnimatePresence mode="wait">
          <Component {...pageProps} />
        </AnimatePresence>
      </Layout>
    </SessionProvider>
  );
}

export default memo(App);

App.propTypes = {
  Component: PropTypes.elementType.isRequired,
  pageProps: PropTypes.shape({
    session: PropTypes.object,
  }).isRequired,
};
