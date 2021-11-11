import get from "lodash/get";
import includes from "lodash/includes";
import orderBy from "lodash/orderBy";

export const aclMenus = (props) => {
  const currentMenus = props.menus.filter((menu) => isRouteEnabled({ ...props, menu }));

  return orderBy(currentMenus, ["index"], ["asc"]);
};

const isRouteEnabled = (props) => includes(props.userAcls, get(props, "menu.url"));
