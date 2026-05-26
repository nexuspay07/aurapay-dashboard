import { useMemo, useState } from "react";

export default function TransactionTable({
  transactions = [],
}) {
  const [statusFilter, setStatusFilter] =
    useState("all");

  const [providerFilter, setProviderFilter] =
    useState("all");

  function formatAmount(
    amount,
    currency
  ) {
    const formatted = Number(
      amount || 0
    ).toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

    return String(
      currency || ""
    ).toLowerCase() === "eur"
      ? `€${formatted}`
      : `$${formatted}`;
  }

  const filteredTransactions =
    useMemo(() => {
      return transactions.filter((tx) => {
        const statusMatch =
          statusFilter === "all"
            ? true
            : tx.status === statusFilter;

        const providerMatch =
          providerFilter === "all"
            ? true
            : tx.provider ===
              providerFilter;

        return (
          statusMatch && providerMatch
        );
      });
    }, [
      transactions,
      statusFilter,
      providerFilter,
    ]);

  function getStatusStyle(status) {
    switch (status) {
      case "completed":
        return {
          background: "#dcfce7",
          color: "#166534",
        };

      case "pending":
        return {
          background: "#fef3c7",
          color: "#92400e",
        };

      case "failed":
        return {
          background: "#fee2e2",
          color: "#991b1b",
        };

      case "refunded":
        return {
          background: "#dbeafe",
          color: "#1d4ed8",
        };

      default:
        return {
          background: "#e5e7eb",
          color: "#374151",
        };
    }
  }

  return (
    <div style={card}>
      {/* ====================================== */}
      {/* HEADER */}
      {/* ====================================== */}

      <div style={header}>
        <div>
          <h2 style={title}>
            Transaction Operations
          </h2>

          <p style={subtitle}>
            Monitor payment flows,
            providers, refunds,
            failures, and routing
            activity.
          </p>
        </div>

        <div style={filters}>
          <select
            value={statusFilter}
            onChange={(e) =>
              setStatusFilter(
                e.target.value
              )
            }
            style={select}
          >
            <option value="all">
              All Statuses
            </option>

            <option value="completed">
              Completed
            </option>

            <option value="pending">
              Pending
            </option>

            <option value="failed">
              Failed
            </option>

            <option value="refunded">
              Refunded
            </option>
          </select>

          <select
            value={providerFilter}
            onChange={(e) =>
              setProviderFilter(
                e.target.value
              )
            }
            style={select}
          >
            <option value="all">
              All Providers
            </option>

            <option value="Stripe">
              Stripe
            </option>

            <option value="PayPal">
              PayPal
            </option>
          </select>
        </div>
      </div>

      {/* ====================================== */}
      {/* TABLE */}
      {/* ====================================== */}

      <div style={tableWrapper}>
        <table style={table}>
          <thead>
            <tr>
              <th style={th}>Amount</th>

              <th style={th}>
                Currency
              </th>

              <th style={th}>
                Provider
              </th>

              <th style={th}>
                Status
              </th>

              <th style={th}>
                Latency
              </th>

              <th style={th}>
                Created
              </th>

              <th style={th}>
                Actions
              </th>
            </tr>
          </thead>

          <tbody>
            {filteredTransactions.map(
              (tx) => (
                <tr key={tx._id}>
                  <td style={td}>
                    {formatAmount(
                      tx.amount,
                      tx.currency
                    )}
                  </td>

                  <td style={td}>
                    {String(
                      tx.currency || ""
                    ).toUpperCase()}
                  </td>

                  <td style={td}>
                    {tx.provider || "-"}
                  </td>

                  <td style={td}>
                    <span
                      style={{
                        ...statusBadge,
                        ...getStatusStyle(
                          tx.status
                        ),
                      }}
                    >
                      {tx.status ||
                        "unknown"}
                    </span>
                  </td>

                  <td style={td}>
                    {typeof tx.latency ===
                    "number"
                      ? `${tx.latency} ms`
                      : "-"}
                  </td>

                  <td style={td}>
                    {tx.createdAt
                      ? new Date(
                          tx.createdAt
                        ).toLocaleString()
                      : "-"}
                  </td>

                  <td style={td}>
                    <div
                      style={
                        actionContainer
                      }
                    >
                      <button
                        style={
                          auditButton
                        }
                      >
                        View
                      </button>

                      {tx.status ===
                        "completed" && (
                        <button
                          style={
                            refundButton
                          }
                        >
                          Refund
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              )
            )}
          </tbody>
        </table>

        {filteredTransactions.length ===
          0 && (
          <div style={emptyState}>
            No transactions found
          </div>
        )}
      </div>
    </div>
  );
}

const card = {
  background: "#fff",
  borderRadius: 20,
  padding: 24,
  border: "1px solid #e5e7eb",
  overflowX: "auto",
};

const header = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: 24,
  gap: 20,
  flexWrap: "wrap",
};

const title = {
  margin: 0,
  fontSize: 28,
  fontWeight: 800,
  color: "#111827",
};

const subtitle = {
  marginTop: 8,
  color: "#6b7280",
};

const filters = {
  display: "flex",
  gap: 12,
};

const select = {
  padding: "10px 14px",
  borderRadius: 10,
  border: "1px solid #d1d5db",
  background: "#fff",
};

const tableWrapper = {
  overflowX: "auto",
};

const table = {
  width: "100%",
  borderCollapse: "collapse",
};

const th = {
  textAlign: "left",
  padding: 14,
  borderBottom: "1px solid #e5e7eb",
  fontSize: 13,
  color: "#6b7280",
};

const td = {
  padding: 14,
  borderBottom: "1px solid #f3f4f6",
  fontSize: 14,
};

const statusBadge = {
  padding: "6px 10px",
  borderRadius: 999,
  fontSize: 12,
  fontWeight: 700,
};

const actionContainer = {
  display: "flex",
  gap: 8,
};

const auditButton = {
  border: "none",
  background: "#111827",
  color: "#fff",
  padding: "8px 12px",
  borderRadius: 8,
  cursor: "pointer",
  fontWeight: 600,
};

const refundButton = {
  border: "none",
  background: "#dc2626",
  color: "#fff",
  padding: "8px 12px",
  borderRadius: 8,
  cursor: "pointer",
  fontWeight: 600,
};

const emptyState = {
  padding: 24,
  textAlign: "center",
  color: "#6b7280",
};