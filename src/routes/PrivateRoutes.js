import React, { useEffect } from "reactn";
import endsWith from "lodash/endsWith";
import map from "lodash/map";
import replace from "lodash/replace";
import { useAcl } from "../hooks";
import { useRouter } from "next/router";
import { spinLoader } from "../components/common/loader";

export const PrivateRoutes = (props) => {
  const router = useRouter();
  const { aclRoutes } = useAcl();

  const { query, pathname } = router;

  const _path = () => {
    const paramNew = _params().find((_param) => _param.value === "new");

    if (paramNew) return replace(pathname, paramNew.name, "new");

    return pathname;
  };

  const _params = () =>
    map(query, (param, key) => ({
      id: key,
      name: `[${key}]`,
      value: param,
    }));

  const isValidUser = () => aclRoutes.some((userAcl) => endsWith(_path(), userAcl));

  useEffect(() => {
    if (!isValidUser()) router.push("/");
  }, [aclRoutes]);

  return isValidUser() ? props.children : spinLoader();
};
