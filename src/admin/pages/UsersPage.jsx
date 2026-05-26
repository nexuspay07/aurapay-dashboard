import { useEffect, useState } from "react";

import API from "../../services/api";

export default function UsersPage() {
  const [users, setUsers] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  async function loadUsers() {
    try {
      const res = await API.get(
        "/admin/users"
      );

      setUsers(res.data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  }

  async function freezeUser(id) {
    try {
      await API.post(
        `/admin/users/${id}/freeze`,
        {
          reason:
            "Administrative action",
        }
      );

      loadUsers();
    } catch (err) {
      console.log(err);
    }
  }

  async function unfreezeUser(id) {
    try {
      await API.post(
        `/admin/users/${id}/unfreeze`
      );

      loadUsers();
    } catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
    loadUsers();
  }, []);

  if (loading) {
    return (
      <div
        style={{
          padding: 30,
        }}
      >
        Loading users...
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
          User Operations
        </h1>

        <p
          style={{
            color: "#6b7280",
          }}
        >
          Manage platform users,
          onboarding, verification,
          and security operations.
        </p>
      </div>

      {/* TABLE */}

      <div
        style={{
          background: "#fff",
          borderRadius: 20,
          border: "1px solid #e5e7eb",
          overflow: "hidden",
        }}
      >
        <table
          style={{
            width: "100%",
            borderCollapse:
              "collapse",
          }}
        >
          <thead
            style={{
              background: "#f9fafb",
            }}
          >
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
                Frozen
              </th>

              <th style={th}>
                Onboarding
              </th>

              <th style={th}>
                Actions
              </th>
            </tr>
          </thead>

          <tbody>
            {users.map((user) => (
              <tr
                key={user._id}
                style={{
                  borderTop:
                    "1px solid #f3f4f6",
                }}
              >
                <td style={td}>
                  {user.email}
                </td>

                <td style={td}>
                  {user.role}
                </td>

                <td style={td}>
                  {user.status}
                </td>

                <td style={td}>
                  {user.frozen
                    ? "YES"
                    : "NO"}
                </td>

                <td style={td}>
                  {user.onboardingCompleted
                    ? "Completed"
                    : "Pending"}
                </td>

                <td style={td}>
                  {!user.frozen ? (
                    <button
                      onClick={() =>
                        freezeUser(
                          user._id
                        )
                      }
                      style={
                        freezeButton
                      }
                    >
                      Freeze
                    </button>
                  ) : (
                    <button
                      onClick={() =>
                        unfreezeUser(
                          user._id
                        )
                      }
                      style={
                        unfreezeButton
                      }
                    >
                      Unfreeze
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const th = {
  textAlign: "left",
  padding: 18,
  fontSize: 14,
  color: "#6b7280",
};

const td = {
  padding: 18,
  fontSize: 14,
  color: "#111827",
};

const freezeButton = {
  border: "none",
  background: "#dc2626",
  color: "#fff",
  padding: "10px 14px",
  borderRadius: 10,
  cursor: "pointer",
  fontWeight: 700,
};

const unfreezeButton = {
  border: "none",
  background: "#059669",
  color: "#fff",
  padding: "10px 14px",
  borderRadius: 10,
  cursor: "pointer",
  fontWeight: 700,
};