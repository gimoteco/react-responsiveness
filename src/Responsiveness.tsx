import React, { ReactNode } from "react";
import { useMediaQuery } from "react-responsive";

export const breakpoints: { [key: string]: any } = {
  desktop: {
    minWidth: 992
  },
  tablet: { minWidth: 768, maxWidth: 991 },
  mobile: { maxWidth: 767 }
};

function useResponsiveHooks() {
  const isDesktop = useMediaQuery(breakpoints.desktop);
  const isTablet = useMediaQuery(breakpoints.tablet);
  const isMobile = useMediaQuery(breakpoints.mobile);

  return { isMobile, isTablet, isDesktop };
}

type ElementOrComponent = (() => ReactNode) | ReactNode;

interface Props {
  children: {
    mobile?: ElementOrComponent;
    tablet?: ElementOrComponent;
    desktop?: ElementOrComponent;
  };
}

function getSpecificElement(elementOrComponent: ElementOrComponent): ReactNode {
  return (elementOrComponent && (
    <>
      {typeof elementOrComponent === "function"
        ? elementOrComponent()
        : elementOrComponent}
    </>
  )) as ReactNode;
}

export function Responsiveness({
  children: { mobile, tablet, desktop }
}: Props) {
  const { isMobile, isTablet, isDesktop } = useResponsiveHooks();

  if (isMobile) return getSpecificElement(mobile) as any;
  if (isTablet) return getSpecificElement(tablet) as any;

  return isDesktop ? (getSpecificElement(desktop) as any) : null;
}
