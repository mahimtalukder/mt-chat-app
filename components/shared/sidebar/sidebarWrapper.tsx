import React from "react";
import DesktopNav from "./nav/DesktopNav";
import MobileNav from "./nav/MobileNav";

type Props = React.PropsWithChildren<{}>;

const sidebarWrapper = ({ children }: Props) => {
  return (
    <div className="h-[calc(100svh-80px)] w-full lg:p-3 flex flex-col lg:flex-row gap-4">
      <MobileNav />
      <DesktopNav />
      <main className="h-[calc(100svh-80px)] w-full lg:h-full flex gap-4">
        {children}
      </main>
    </div>
  );
};

export default sidebarWrapper;
