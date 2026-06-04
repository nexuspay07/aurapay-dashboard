import { useEffect, useState } from "react";
import API from "../../services/api";

export default function SettlementOperationsPage() {
  const [settlements, setSettlements] =
    useState([]);

  useEffect(() => {
    loadSettlements();
  }, []);

  async function loadSettlements() {
    try {
      const res =
        await API.get(
          "/settlements"
        );

      setSettlements(res.data);
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

  return (
    <div style={page}>
      <h1 style={title}>
        Settlement Operations Center
      </h1>

      <p style={subtitle}>
        Review and complete
        merchant settlements.
      </p>

      <div style={tableCard}>
        <table style={table}>
          <thead>
            <tr>
              <th>Amount</th>
              <th>Currency</th>
              <th>Status</th>
              <th>Transactions</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {settlements.map(
              (settlement) => (
                <tr
                  key={
                    settlement._id
                  }
                >
                  <td>
                    $
                    {
                      settlement.amount
                    }
                  </td>

                  <td>
                    {
                      settlement.currency
                    }
                  </td>

                  <td>
                    {
                      settlement.status
                    }
                  </td>

                  <td>
                    {
                      settlement.transactionCount
                    }
                  </td>

                  <td>
                    {settlement.status !==
                    "completed" ? (
                      <button
                        onClick={() =>
                          completeSettlement(
                            settlement._id
                          )
                        }
                      >
                        Complete
                      </button>
                    ) : (
                      "Completed"
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

const page = {
  padding: 32,
};

const title = {
  fontSize: 40,
  fontWeight: 800,
};

const subtitle = {
  color: "#64748B",
};

const tableCard = {
  background: "#fff",
  borderRadius: 20,
  padding: 24,
  marginTop: 24,
  border:
    "1px solid #E2E8F0",
};

const table = {
  width: "100%",
};