import { useEffect, useState } from "react";
import API from "../../services/api";

export default function MerchantTransactions() {
  const [transactions, setTransactions] =
    useState([]);

  useEffect(() => {
    loadTransactions();
  }, []);

  async function loadTransactions() {
    try {
      const res =
        await API.get(
          "/transactions"
        );

      setTransactions(res.data);
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <div style={page}>
      <h1 style={title}>
        Transaction Center
      </h1>

      <p style={subtitle}>
        Monitor customer payments
        and transaction activity.
      </p>

      <div style={tableCard}>
        <table style={table}>
          <thead>
            <tr>
              <th>Payment ID</th>
              <th>Amount</th>
              <th>Currency</th>
              <th>Status</th>
              <th>Provider</th>
              <th>Date</th>
            </tr>
          </thead>

          <tbody>
            {transactions.map(
              (tx) => (
                <tr key={tx._id}>
                  <td>
                    {
                      tx.providerPaymentId
                    }
                  </td>

                  <td>
                    ${tx.amount}
                  </td>

                  <td>
                    {
                      tx.currency
                    }
                  </td>

                  <td>
                    {
                      tx.status
                    }
                  </td>

                  <td>
                    {
                      tx.provider
                    }
                  </td>

                  <td>
                    {new Date(
                      tx.createdAt
                    ).toLocaleDateString()}
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