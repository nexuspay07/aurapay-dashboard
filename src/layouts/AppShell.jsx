import { useState } from "react";

import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

export default function AppShell({
  menu,
  title,
  children,
}) {
  const [collapsed, setCollapsed] =
    useState(false);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#F8FAFC",
      }}
    >
      <Sidebar
        menu={menu}
        collapsed={collapsed}
      />

      <div
        style={{
          marginLeft: collapsed
            ? 90
            : 270,

          transition:
            "margin .25s ease",
        }}
      >
        <Topbar
          title={title}
          onToggleSidebar={() =>
            setCollapsed(!collapsed)
          }
        />

        <main
          style={{
            padding: 32,
          }}
        >
          {children}
        </main>
      </div>
    </div>
  );
}