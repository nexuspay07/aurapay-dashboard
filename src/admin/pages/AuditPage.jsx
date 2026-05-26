import {
  useEffect,
  useState,
} from "react";

import API from "../../services/api";

export default function AuditPage() {
  const [logs, setLogs] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  async function loadLogs() {
    try {
      const res = await API.get(
        "/audit/logs"
      );

      setLogs(res.data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadLogs();
  }, []);

  if (loading) {
    return (
      <div style={{ padding: 30 }}>
        Loading audit logs...
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
          Audit & Compliance
        </h1>

        <p
          style={{
            color: "#6b7280",
          }}
        >
          Immutable operational
          records and compliance
          monitoring.
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
                Admin
              </th>

              <th style={th}>
                Action
              </th>

              <th style={th}>
                Severity
              </th>

              <th style={th}>
                Target
              </th>

              <th style={th}>
                Created
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
                  {
                    log.admin
                      ?.email
                  }
                </td>

                <td style={td}>
                  {log.action}
                </td>

                <td style={td}>
                  <span
                    style={{
                      padding:
                        "6px 10px",
                      borderRadius: 999,
                      background:
                        getSeverityBg(
                          log.severity
                        ),
                      color:
                        getSeverityColor(
                          log.severity
                        ),
                      fontWeight: 700,
                      fontSize: 12,
                    }}
                  >
                    {log.severity}
                  </span>
                </td>

                <td style={td}>
                  {
                    log.targetType
                  }
                </td>

                <td style={td}>
                  {new Date(
                    log.createdAt
                  ).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function getSeverityBg(
  severity
) {
  switch (severity) {
    case "critical":
      return "#fee2e2";

    case "high":
      return "#fef3c7";

    case "medium":
      return "#dbeafe";

    default:
      return "#e5e7eb";
  }
}

function getSeverityColor(
  severity
) {
  switch (severity) {
    case "critical":
      return "#991b1b";

    case "high":
      return "#92400e";

    case "medium":
      return "#1d4ed8";

    default:
      return "#374151";
  }
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