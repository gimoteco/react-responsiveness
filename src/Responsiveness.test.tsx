import React, { ComponentType } from "react";
import { render } from "@testing-library/react";
import { Responsiveness, breakpoints } from "./Responsiveness";
import { useMediaQuery } from "react-responsive";
import { keyBy } from "lodash";

function MobileExample() {
  return <div>MobileExample</div>;
}

function TabletExample() {
  return <div>TabletExample</div>;
}

function DesktopExample() {
  return <div>DesktopExample</div>;
}

function DefaultComponent() {
  return <div>DefaultComponent</div>;
}

const sampleComponents = {
  mobile: MobileExample,
  tablet: TabletExample,
  desktop: DesktopExample
} as any;

const testData = Object.keys(breakpoints).map(key => ({
  viewport: key,
  specificComponent: sampleComponents[key]
}));

const mockUseMediaQuery = (viewport: any, value: boolean) => {
  (useMediaQuery as jest.Mock).mockImplementation(p => {
    return p === breakpoints[viewport] ? value : false;
  });
};

const mockUseMediaQuery2 = ({
  mobile,
  tablet,
  desktop
}: {
  mobile: boolean;
  tablet: boolean;
  desktop: boolean;
}) => {
  (useMediaQuery as jest.Mock).mockImplementation(p => {
    if (p === breakpoints.mobile) return mobile || false;
    else if (p === breakpoints.tablet) return tablet || false;
    else return desktop || false;
  });
};

jest.mock("react-responsive", () => ({
  useMediaQuery: jest.fn()
}));

const viewports = Object.keys(breakpoints);
describe("Responsiveness", () => {
  it.each([
    ["mobile", MobileExample, "MobileExample"],
    ["tablet", TabletExample, "TabletExample"],
    ["desktop", DesktopExample, "DesktopExample"]
  ])(
    "should render the %p specific component",
    (viewport, SpecificComponent, expectedText) => {
      mockUseMediaQuery(viewport, true);

      const { container } = render(
        <Responsiveness>
          {{ [viewport as any]: SpecificComponent }}
        </Responsiveness>
      );

      expect(container.textContent).toBe(expectedText);
    }
  );

  it.each([
    ["mobile", MobileExample],
    ["tablet", TabletExample],
    ["desktop", DesktopExample]
  ])(
    "should not render the %p specific component",
    (viewport, SpecificComponent) => {
      mockUseMediaQuery(viewport, false);

      const { container } = render(
        <Responsiveness>
          {{ [viewport as any]: SpecificComponent }}
        </Responsiveness>
      );

      expect(container.textContent).toBe("");
    }
  );

  it.each<[string, ComponentType]>([
    ["mobile", MobileExample],
    ["tablet", TabletExample],
    ["desktop", DesktopExample]
  ])("should render the %p specific element", (viewport, SpecificComponent) => {
    mockUseMediaQuery(viewport, true);

    const { container } = render(
      <Responsiveness>
        {{ [viewport as any]: <SpecificComponent></SpecificComponent> }}
      </Responsiveness>
    );

    expect(container.textContent).toBe(SpecificComponent.name);
  });

  it("should render nothing when no components are passed", () => {
    const { container } = render(<Responsiveness>{{}}</Responsiveness>);

    expect(container.textContent).toBe("");
  });

  it.each(viewports)(
    "should render nothing when the %p component is not present",
    viewport => {
      viewports
        .filter(key => key !== viewport)
        .map(key => mockUseMediaQuery(key, false));
      mockUseMediaQuery(viewport, true);

      const { container } = render(
        <Responsiveness>
          {testData.filter(k => k.viewport !== viewport)}
        </Responsiveness>
      );

      expect(container.textContent).toBe("");
    }
  );

  it.each(viewports)(
    "should render the default when the %p component is not present",
    viewport => {
      mockUseMediaQuery2({
        mobile: viewport === "mobile",
        tablet: viewport === "tablet",
        desktop: viewport === "desktop"
      });

      const { container } = render(
        <Responsiveness>
          {{
            ...sampleComponents,
            [viewport]: undefined,
            default: DefaultComponent
          }}
        </Responsiveness>
      );

      expect(container.textContent).toBe(DefaultComponent.name);
    }
  );

  it.each(viewports)(
    "should pass responsive hook params to default component",
    viewport => {
      const hooks = {
        mobile: viewport === "mobile",
        tablet: viewport === "tablet",
        desktop: viewport === "desktop"
      };
      mockUseMediaQuery2(hooks);

      function SpyOnComponent({ isMobile, isTablet, isDesktop }: any) {
        expect(isMobile).toBe(hooks.mobile);
        expect(isTablet).toBe(hooks.tablet);
        expect(isDesktop).toBe(hooks.desktop);
        return null;
      }

      render(
        <Responsiveness>
          {{
            default: SpyOnComponent
          }}
        </Responsiveness>
      );
    }
  );
});
