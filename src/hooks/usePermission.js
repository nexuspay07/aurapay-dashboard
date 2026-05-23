import { useMemo } from "react";

export default function usePermission() {
  const adminUser = useMemo(() => {
    try {
      return JSON.parse(
        localStorage.getItem("adminUser")
      );
    } catch {
      return null;
    }
  }, []);

  const permissions =
    adminUser?.permissions || [];

  const role = adminUser?.role;

  function hasPermission(permission) {
    if (role === "super_admin") {
      return true;
    }

    return permissions.includes(
      permission
    );
  }

  return {
    role,
    permissions,
    hasPermission,
    adminUser,
  };
}