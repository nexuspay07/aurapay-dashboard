import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import "../admin.css";

export default function AdminLayout() {
  return <div className="admin-shell" data-testid="admin-shell"><Sidebar /><div className="admin-main"><Topbar /><main className="admin-content" id="admin-content"><Outlet /></main></div></div>;
}
