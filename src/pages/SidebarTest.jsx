import Sidebar from "../layouts/Sidebar";
import { merchantMenu } from "../data/sidebarMenu";

export default function SidebarTest() {
  return (
    <>
      <Sidebar
        menu={merchantMenu}
      />

      <div
        style={{
          marginLeft: 270,

          padding: 40,
        }}
      >
        <h1>Merchant Dashboard</h1>

        <p>
          Sidebar successfully loaded.
        </p>

        <p>
          This area will become the
          Application Shell.
        </p>
      </div>
    </>
  );
}