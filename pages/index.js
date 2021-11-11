import React from "reactn";
import { SEOMeta } from "../src/components/common/seo";
import Login from "../src/pages/login";

const Init = (props) => (
  <>
    <SEOMeta {...props} />
    <Login {...props} />
  </>
);

export default Init;
