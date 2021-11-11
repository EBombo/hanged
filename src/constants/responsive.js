import React from "react";
import Responsive from "react-responsive";
import { breakPoints } from "./breakPoints";

const Desktop = (props) => <Responsive {...props} minWidth={breakPoints.tablet} />;

const Tablet = (props) => <Responsive {...props} maxWidth={breakPoints.tablet} />;

const Mobile = (props) => <Responsive {...props} maxWidth={breakPoints.mobile} />;

const Kiosk = (props) => <Responsive {...props} minDeviceWidth={1080} maxDeviceWidth={1080} />;

export { Desktop, Tablet, Mobile, Kiosk };
