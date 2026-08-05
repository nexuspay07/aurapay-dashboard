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
      className="app-shell"
      style={{
        minHeight: "100vh",
        background: "#F8FAFC",
        maxWidth: "100vw",
        overflowX: "hidden",
      }}
    >
      <style>{responsiveShellStyles}</style>
      <Sidebar
        menu={menu}
        collapsed={collapsed}
      />

      <div
        className="app-shell-content"
        style={{
          marginLeft: collapsed
            ? 90
            : 270,
          maxWidth: collapsed
            ? "calc(100vw - 90px)"
            : "calc(100vw - 270px)",

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
          className="app-shell-main"
          style={{
            padding: 32,
            boxSizing: "border-box",
            maxWidth: "100%",
            overflowX: "hidden",
          }}
        >
          {children}
        </main>
      </div>
    </div>
  );
}

const responsiveShellStyles = `
  .app-shell,
  .app-shell-content,
  .app-shell-main {
    box-sizing: border-box;
  }

  .app-shell-main * {
    box-sizing: border-box;
  }

  .app-shell-main pre,
  .app-shell-main code {
    white-space: pre-wrap;
    word-break: break-word;
  }

  @media (max-width: 820px) {
    .app-shell-sidebar {
      width: 78px !important;
    }

    .app-shell-content {
      margin-left: 78px !important;
      max-width: calc(100vw - 78px) !important;
    }

    .app-shell-main {
      padding: 18px !important;
    }

    .app-shell-sidebar-brand {
      font-size: 0 !important;
      text-align: center !important;
    }

    .app-shell-sidebar-brand::after {
      content: "A";
      font-size: 24px;
    }

    .app-shell-sidebar-label,
    .app-shell-sidebar-tagline,
    .app-shell-sidebar-footer {
      display: none !important;
    }

    .app-shell-topbar {
      padding-left: 16px !important;
      padding-right: 16px !important;
      gap: 12px !important;
    }

    .app-shell-topbar h2 {
      font-size: 22px !important;
    }

    .app-shell-search {
      display: none !important;
    }

    .app-shell-user-meta {
      display: none !important;
    }

    .app-shell-main section,
    .app-shell-main form,
    .app-shell-main article {
      max-width: 100%;
      min-width: 0;
    }
  }

  @media (max-width: 520px) {
    .app-shell-sidebar {
      width: 68px !important;
    }

    .app-shell-content {
      margin-left: 68px !important;
      max-width: calc(100vw - 68px) !important;
    }
  }
`;
