import React, { useGlobal } from "reactn";
import { DrawerContainer } from "../common/DrawerContainer";

export const RightDrawer = (props) => {
  const [openRightDrawer, setOpenRightDrawer] = useGlobal("openRightDrawer");

  return (
    <DrawerContainer placement="right" onClose={() => setOpenRightDrawer(false)} visible={openRightDrawer} {...props}>
      {props.children}
    </DrawerContainer>
  );
};
