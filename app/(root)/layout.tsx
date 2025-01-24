import SidebarWrapper from "@/components/shared/sidebar/sidebarWrapper";
import Topbar from "@/components/shared/Topbar";
import React from "react";

type Props = React.PropsWithChildren<{}>;

const Layout = ({ children }: Props) => {
  return (
    <div className="flex flex-col h-screen w-full">
      <Topbar title="MT Chat APP" />
      <SidebarWrapper>{children}</SidebarWrapper>
    </div>
  );
};

export default Layout;
