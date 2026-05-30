import {
  useEffect,
  useState,
} from "react";

import API from "../../services/api";

export default function SettlementsPage() {
  const [settlements, setSettlements] =
    useState([]);

  async function loadSettlements() {
    try {
      const res =
        await API.get(
          "/settlements"
        );

      setSettlements(
        res.data
      );
    } catch (err) {
      console.log(err);
    }
  }

  async function completeSettlement(
    id
  ) {
    try {
      await API.patch(
        `/settlements/${id}/complete`
      );

      loadSettlements();
    } catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
    loadSettlements();
  }, []);

  return (
    <div>
      <h1
        style={{
          fontSize: 36,
          fontWeight: 800,
          marginBottom: 24,
        }}
      >
        Settlement Operations
      </h1>

      <div style={card}>
        <table style={table}>
          <thead>
            <tr>
              <th style={th}>
                Merchant
              </th>

              <th style={th}>
                Amount
              </th>

              <th style={th}>
                Currency
              </th>

              <th style={th}>
                Status
              </th>

              <th style={th}>
                Actions
              </th>
            </tr>
          </thead>

          <tbody>
            {settlements.map(
              (
                settlement
              ) => (
                <tr
                  key={
                    settlement._id
                  }
                >
                  <td style={td}>
                    {
                      settlement
                        .merchantId
                        ?.businessName
                    }
                  </td>

                  <td style={td}>
                    $
                    {
                      settlement.amount
                    }
                  </td>

                  <td style={td}>
                    {
                      settlement.currency
                    }
                  </td>

                  <td style={td}>
                    {
                      settlement.status
                    }
                  </td>

                  <td style={td}>
                    {settlement.status !==
                      "completed" && (
                      <button
                        style={
                          completeButton
                        }
                        onClick={() =>
                          completeSettlement(
                            settlement._id
                          )
                        }
                      >
                        Complete
                      </button>
                    )}
                  </td>
                </tr>
              )
            )}
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
  border:
    "1px solid #e5e7eb",
};

const table = {
  width: "100%",
  borderCollapse:
    "collapse",
};

const th = {
  textAlign: "left",
  padding: 16,
  borderBottom:
    "1px solid #e5e7eb",
};

const td = {
  padding: 16,
  borderBottom:
    "1px solid #f3f4f6",
};

const completeButton = {
  border: "none",
  background: "#10b981",
  color: "#fff",
  padding: "8px 12px",
  borderRadius: 8,
  cursor: "pointer",
};