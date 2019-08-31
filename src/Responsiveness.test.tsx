import React, { ComponentType } from "react";
import { render } from "@testing-library/react";
import { Responsiveness, breakpoints } from "./Responsiveness";
import { useMediaQuery } from "react-responsive";

function MobileExample() {
  return <div>MobileExample</div>;
}

function TabletExample() {
  return <div>TabletExample</div>;
}

function DesktopExample() {
  return <div>DesktopExample</div>;
}

const mockUseMediaQuery = (viewport: any, value: boolean) => {
  (useMediaQuery as jest.Mock).mockImplementation(p => {
    return p === breakpoints[viewport] ? value : false;
  });
};

jest.mock("react-responsive", () => ({
  useMediaQuery: jest.fn()
}));

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
});
