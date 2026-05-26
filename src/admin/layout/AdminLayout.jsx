import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

export default function AdminLayout({
  children,
}) {
  return (
    <div style={layout}>
      <Sidebar />

      <div style={mainArea}>
        <Topbar />

        <main style={content}>
          {children}
        </main>
      </div>
    </div>
  );
}

const layout = {
  display: "flex",
  minHeight: "100vh",
  background: "#f3f4f6",
};

const mainArea = {
  flex: 1,
  display: "flex",
  flexDirection: "column",
};

const content = {
  flex: 1,
  padding: 24,
};