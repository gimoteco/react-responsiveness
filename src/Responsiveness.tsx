import React, { ReactNode } from "react";
import { useMediaQuery } from "react-responsive";

interface ResponsiveHooksProps {
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
}

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

type ElementOrComponentWithHooksProps =
  | ((props: ResponsiveHooksProps) => ReactNode)
  | ReactNode;

type ElementOrComponent = (() => ReactNode) | ReactNode;

interface Props {
  children: {
    mobile?: ElementOrComponent;
    tablet?: ElementOrComponent;
    desktop?: ElementOrComponent;
    default?: ElementOrComponentWithHooksProps;
  };
}

function extractElement(
  target: ElementOrComponent | ElementOrComponentWithHooksProps,
  responsiveHooks?: any
) {
  return typeof target === "function" ? target(responsiveHooks) : target;
}

function getSpecificElement(
  elementOrComponent: ElementOrComponent,
  fallback: ElementOrComponent,
  responsiveHooks: ResponsiveHooksProps
): ReactNode {
  return (elementOrComponent ? (
    <>{extractElement(elementOrComponent)}</>
  ) : fallback ? (
    <>{extractElement(fallback, responsiveHooks)}</>
  ) : null) as ReactNode;
}

export function Responsiveness({
  children: { mobile, tablet, desktop, default: fallback }
}: Props) {
  const responsiveHooks = useResponsiveHooks();
  const { isMobile, isTablet, isDesktop } = responsiveHooks;

  if (isMobile)
    return getSpecificElement(mobile, fallback, responsiveHooks) as any;
  else if (isTablet)
    return getSpecificElement(tablet, fallback, responsiveHooks) as any;

  return (
    isDesktop && (getSpecificElement(desktop, fallback, responsiveHooks) as any)
  );
}
