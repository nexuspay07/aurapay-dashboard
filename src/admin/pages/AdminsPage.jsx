import {
  useEffect,
  useState,
} from "react";

import API from "../../services/api";

const roles = [
  "super_admin",
  "finance_admin",
  "risk_admin",
  "support_admin",
  "auditor",
];

export default function AdminsPage() {
  const [admins, setAdmins] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [form, setForm] =
    useState({
      email: "",
      password: "",
      role: "support_admin",
    });

  async function loadAdmins() {
    try {
      const res = await API.get(
        "/admin-auth/admins"
      );

      setAdmins(res.data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  }

  async function createAdmin(
    e
  ) {
    e.preventDefault();

    try {
      await API.post(
        "/admin-auth/create-admin",
        form
      );

      setForm({
        email: "",
        password: "",
        role:
          "support_admin",
      });

      loadAdmins();
    } catch (err) {
      console.log(err);
      alert(
        err?.response?.data
          ?.error ||
          "Failed to create admin"
      );
    }
  }

  useEffect(() => {
    loadAdmins();
  }, []);

  if (loading) {
    return (
      <div style={{ padding: 30 }}>
        Loading admins...
      </div>
    );
  }

  return (
    <div>
      {/* HEADER */}

      <div
        style={{
          marginBottom: 28,
        }}
      >
        <h1
          style={{
            fontSize: 34,
            fontWeight: 800,
            color: "#111827",
            marginBottom: 8,
          }}
        >
          Admin Management
        </h1>

        <p
          style={{
            color: "#6b7280",
          }}
        >
          Manage enterprise
          administrators, roles,
          permissions, and
          organizational access.
        </p>
      </div>

      {/* CREATE ADMIN */}

      <div style={card}>
        <h2 style={sectionTitle}>
          Create Admin
        </h2>

        <form
          onSubmit={createAdmin}
          style={formStyle}
        >
          <input
            style={input}
            type="email"
            placeholder="Admin Email"
            value={form.email}
            onChange={(e) =>
              setForm({
                ...form,
                email:
                  e.target.value,
              })
            }
            required
          />

          <input
            style={input}
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={(e) =>
              setForm({
                ...form,
                password:
                  e.target.value,
              })
            }
            required
          />

          <select
            style={input}
            value={form.role}
            onChange={(e) =>
              setForm({
                ...form,
                role:
                  e.target.value,
              })
            }
          >
            {roles.map((role) => (
              <option
                key={role}
                value={role}
              >
                {role}
              </option>
            ))}
          </select>

          <button
            type="submit"
            style={button}
          >
            Create Admin
          </button>
        </form>
      </div>

      {/* ADMIN TABLE */}

      <div style={card}>
        <h2 style={sectionTitle}>
          Organization Admins
        </h2>

        <table style={table}>
          <thead>
            <tr>
              <th style={th}>
                Email
              </th>

              <th style={th}>
                Role
              </th>

              <th style={th}>
                Status
              </th>

              <th style={th}>
                Permissions
              </th>
            </tr>
          </thead>

          <tbody>
            {admins.map((admin) => (
              <tr key={admin._id}>
                <td style={td}>
                  {admin.email}
                </td>

                <td style={td}>
                  {admin.role}
                </td>

                <td style={td}>
                  {admin.status}
                </td>

                <td style={td}>
                  <div
                    style={
                      permissionContainer
                    }
                  >
                    {admin.permissions?.map(
                      (
                        permission
                      ) => (
                        <span
                          key={
                            permission
                          }
                          style={
                            permissionBadge
                          }
                        >
                          {
                            permission
                          }
                        </span>
                      )
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const card = {
  background: "#fff",
  borderRadius: 20,
  padding: 24,
  border: "1px solid #e5e7eb",
  marginBottom: 24,
};

const sectionTitle = {
  marginBottom: 20,
  fontSize: 22,
  fontWeight: 800,
  color: "#111827",
};

const formStyle = {
  display: "grid",
  gridTemplateColumns:
    "repeat(auto-fit, minmax(220px, 1fr))",
  gap: 16,
};

const input = {
  padding: 14,
  borderRadius: 12,
  border: "1px solid #d1d5db",
};

const button = {
  border: "none",
  background: "#111827",
  color: "#fff",
  borderRadius: 12,
  padding: "14px 18px",
  fontWeight: 700,
  cursor: "pointer",
};

const table = {
  width: "100%",
  borderCollapse: "collapse",
};

const th = {
  textAlign: "left",
  padding: 16,
  borderBottom: "1px solid #e5e7eb",
  color: "#6b7280",
  fontSize: 14,
};

const td = {
  padding: 16,
  borderBottom: "1px solid #f3f4f6",
  fontSize: 14,
};

const permissionContainer = {
  display: "flex",
  flexWrap: "wrap",
  gap: 8,
};

const permissionBadge = {
  padding: "6px 10px",
  borderRadius: 999,
  background: "#e5e7eb",
  fontSize: 12,
  fontWeight: 700,
};