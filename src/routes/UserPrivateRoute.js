import React, { useEffect, useGlobal } from "reactn";
import { spinLoader } from "../components/common/loader";

export const UserPrivateRoute = (props) => {
  const [authUser] = useGlobal("user");

  useEffect(() => {
    if (!authUser && typeof window !== "undefined") window.location.href = "/";
  }, [authUser]);

  return authUser ? props.children : spinLoader();
};
