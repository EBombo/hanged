import React from "reactn";
import Head from "next/head";
import isEmpty from "lodash/isEmpty";
import get from "lodash/get";

export const SEOMeta = (props) =>
  isEmpty(props.seo) ? null : (
    <Head>
      <title>{get(props, "seo.title", "Bingo Ebombo")}</title>
      {get(props, "seo.description") && <meta name="description" content={props.seo.description} />}
      {get(props, "seo.keywords") && <meta name="keywords" content={props.seo.keywords} />}
    </Head>
  );
