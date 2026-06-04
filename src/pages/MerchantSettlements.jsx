import { useEffect, useState } from "react";
import API from "../../services/api";

export default function MerchantSettlements() {
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

  return (
    <div style={page}>
      <h1 style={title}>
        Settlement Center
      </h1>

      <p style={subtitle}>
        Monitor settlement activity
        and payout status.
      </p>

      <div style={tableCard}>
        <table style={table}>
          <thead>
            <tr>
              <th>Amount</th>
              <th>Currency</th>
              <th>Status</th>
              <th>Transactions</th>
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
  marginTop: 24,
  background: "#fff",
  borderRadius: 20,
  padding: 24,
  border:
    "1px solid #E2E8F0",
};

const table = {
  width: "100%",
};