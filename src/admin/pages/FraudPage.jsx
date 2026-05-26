import { useEffect, useState } from "react";

import API from "../../services/api";

export default function FraudPage() {
  const [logs, setLogs] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  async function loadFraudLogs() {
    try {
      const res = await API.get(
        "/admin/fraud-logs"
      );

      setLogs(res.data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  }

  async function freezeUser(userId) {
    try {
      await API.post(
        `/admin/users/${userId}/freeze`,
        {
          reason:
            "Fraud investigation",
        }
      );

      loadFraudLogs();
    } catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
    loadFraudLogs();
  }, []);

  if (loading) {
    return (
      <div style={{ padding: 30 }}>
        Loading fraud logs...
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
          Fraud Command Center
        </h1>

        <p
          style={{
            color: "#6b7280",
          }}
        >
          Monitor suspicious
          activity, investigate
          fraud signals, and
          secure the platform.
        </p>
      </div>

      {/* METRICS */}

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit, minmax(220px, 1fr))",
          gap: 20,
          marginBottom: 30,
        }}
      >
        <MetricCard
          title="Fraud Alerts"
          value={logs.length}
          subtitle="Total risk events"
        />

        <MetricCard
          title="High Risk"
          value={
            logs.filter(
              (log) =>
                log.severity ===
                "high"
            ).length
          }
          subtitle="Critical incidents"
        />

        <MetricCard
          title="Frozen Users"
          value={
            logs.filter(
              (log) =>
                log.user?.frozen
            ).length
          }
          subtitle="Accounts locked"
        />
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
                User
              </th>

              <th style={th}>
                Risk Type
              </th>

              <th style={th}>
                Severity
              </th>

              <th style={th}>
                Created
              </th>

              <th style={th}>
                Action
              </th>
            </tr>
          </thead>

          <tbody>
            {logs.map((log) => (
              <tr
                key={log._id}
                style={{
                  borderTop:
                    "1px solid #f3f4f6",
                }}
              >
                <td style={td}>
                  {log.user?.email}
                </td>

                <td style={td}>
                  {log.type}
                </td>

                <td style={td}>
                  <span
                    style={{
                      padding:
                        "6px 10px",
                      borderRadius: 999,
                      background:
                        log.severity ===
                        "high"
                          ? "#fee2e2"
                          : "#fef3c7",
                      color:
                        log.severity ===
                        "high"
                          ? "#991b1b"
                          : "#92400e",
                      fontWeight: 700,
                      fontSize: 12,
                    }}
                  >
                    {log.severity}
                  </span>
                </td>

                <td style={td}>
                  {new Date(
                    log.createdAt
                  ).toLocaleString()}
                </td>

                <td style={td}>
                  {log.user &&
                    !log.user
                      .frozen && (
                      <button
                        onClick={() =>
                          freezeUser(
                            log.user
                              ._id
                          )
                        }
                        style={
                          freezeButton
                        }
                      >
                        Freeze User
                      </button>
                    )}

                  {log.user
                    ?.frozen && (
                    <span
                      style={{
                        color:
                          "#dc2626",
                        fontWeight: 700,
                      }}
                    >
                      Frozen
                    </span>
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

function MetricCard({
  title,
  value,
  subtitle,
}) {
  return (
    <div
      style={{
        background: "#fff",
        borderRadius: 18,
        padding: 24,
        border: "1px solid #e5e7eb",
      }}
    >
      <p
        style={{
          color: "#6b7280",
          marginBottom: 10,
          fontSize: 14,
        }}
      >
        {title}
      </p>

      <h2
        style={{
          fontSize: 38,
          fontWeight: 800,
          color: "#111827",
          margin: 0,
        }}
      >
        {value}
      </h2>

      <p
        style={{
          marginTop: 10,
          color: "#9ca3af",
          fontSize: 13,
        }}
      >
        {subtitle}
      </p>
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