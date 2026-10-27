import { useEffect, useRef, useState } from "react";

import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import "./merchantShell.css";

export default function AppShell({ menu, title, children }) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(() => window.matchMedia("(max-width: 900px)").matches);
  const menuButtonRef = useRef(null);

  useEffect(() => {
    const media = window.matchMedia("(max-width: 900px)");
    function updateViewport(event) {
      setIsMobile(event.matches);
      if (!event.matches) setMobileOpen(false);
    }
    media.addEventListener("change", updateViewport);
    return () => media.removeEventListener("change", updateViewport);
  }, []);

  useEffect(() => {
    if (!mobileOpen) return undefined;

    function handleDrawerKeydown(event) {
      if (event.key === "Escape") {
        closeMobileSidebar({ restoreFocus: true });
        return;
      }

      if (event.key === "Tab") {
        const drawer = document.querySelector("#merchant-navigation");
        const focusable = drawer
          ? [...drawer.querySelectorAll('button:not([disabled]), a[href]')]
          : [];
        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last?.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first?.focus();
        }
      }
    }

    document.addEventListener("keydown", handleDrawerKeydown);
    return () => document.removeEventListener("keydown", handleDrawerKeydown);
  }, [mobileOpen]);

  useEffect(() => {
    if (mobileOpen) {
      document.querySelector("#merchant-navigation .app-shell-sidebar-link.is-active")?.focus();
    }
  }, [mobileOpen]);

  function toggleSidebar() {
    if (window.matchMedia("(max-width: 900px)").matches) {
      setMobileOpen((open) => !open);
      return;
    }
    setCollapsed((value) => !value);
  }

  function closeMobileSidebar({ restoreFocus = false } = {}) {
    setMobileOpen(false);
    if (restoreFocus) requestAnimationFrame(() => menuButtonRef.current?.focus());
  }

  return (
    <div className={`app-shell${collapsed ? " is-collapsed" : ""}${mobileOpen ? " is-mobile-open" : ""}`}>
      <Sidebar
        menu={menu}
        collapsed={collapsed}
        isMobile={isMobile}
        mobileOpen={mobileOpen}
        onClose={() => closeMobileSidebar({ restoreFocus: true })}
        onNavigate={closeMobileSidebar}
      />

      {mobileOpen && (
        <button
          className="app-shell-backdrop"
          type="button"
          aria-hidden="true"
          tabIndex={-1}
          onClick={() => closeMobileSidebar({ restoreFocus: true })}
        />
      )}

      <div className="app-shell-content" inert={isMobile && mobileOpen ? "" : undefined}>
        <Topbar
          title={title}
          menuButtonRef={menuButtonRef}
          menuOpen={isMobile ? mobileOpen : !collapsed}
          onToggleSidebar={toggleSidebar}
        />
        <main className="app-shell-main">{children}</main>
      </div>
    </div>
  );
}
