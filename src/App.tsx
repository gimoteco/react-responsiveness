import React from "react";
import { Responsiveness } from "./Responsiveness";

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

const App: React.FC = () => {
  return (
    <Responsiveness>
      {{
        tablet: TabletExample,
        mobile: MobileExample,
        desktop: DesktopExample,
        default: ({ isTablet, isMobile, isDesktop }) =>
          isMobile ? "mobile" : "non-mobile"
      }}
    </Responsiveness>
  );
};

export default App;
