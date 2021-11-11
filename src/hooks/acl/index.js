import React, { useGlobal } from "reactn";
import { Acl } from "./Acl";
import { AclLink } from "./AclLink";
import { aclMenus } from "./aclMenus";
import { aclRoutes } from "./aclRoutes";
import get from "lodash/get";
import flatMap from "lodash/flatMap";

export const useAcl = () => {
  const [authUser] = useGlobal("user");

  const userAcls = flatMap(Object.values(get(authUser, "acls", {})));

  return {
    Acl: (props) => Acl({ ...props, userAcls }),
    AclLink: (props) => AclLink({ ...props, userAcls }),
    aclMenus: (props) => aclMenus({ ...props, userAcls }),
    aclRoutes: aclRoutes({ userAcls }),
    userAcls,
  };
};
