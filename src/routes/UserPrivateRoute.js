import React, { useEffect, useGlobal } from "reactn";
import { useRouter } from "next/router";
import { spinLoader } from "../components/common/loader";

export const UserPrivateRoute = (props) => {
  const [authUser] = useGlobal("user");

  const router = useRouter();

  useEffect(() => {
    if (!authUser) router.push("/");
  }, [authUser]);

  return authUser ? props.children : spinLoader();
};
