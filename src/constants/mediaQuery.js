import { breakPoints } from "./breakPoints";

export const mediaQuery = {
  afterMobileXs: `@media (min-width: ${breakPoints.mobile_xs}px)`,
  afterMobileS: `@media (min-width: ${breakPoints.mobile_s}px)`,
  afterMobile: `@media (min-width: ${breakPoints.mobile}px)`,
  afterTablet: `@media (min-width: ${breakPoints.tablet}px)`,
  afterDesktop: `@media (min-width: ${breakPoints.desktop}px)`,
  afterHighResolution: `@media (min-width: ${breakPoints.high_resolution}px)`,
};
