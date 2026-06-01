import {
  useEffect,
  useState,
} from "react";

import API from "../../services/api";

export default function CheckoutOperationsPage() {
  const [sessions, setSessions] =
    useState([]);

  useEffect(() => {
    loadSessions();
  }, []);

  async function loadSessions() {
    try {
      const res =
        await API.get(
          "/checkout-ops/sessions"
        );

      setSessions(
        res.data || []
      );
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <div>
      <h1>
        Checkout Operations
        Center
      </h1>

      <p>
        Monitor AuraPay
        checkout activity.
      </p>

      <table
        style={{
          width: "100%",
          marginTop: 20,
        }}
      >
        <thead>
          <tr>
            <th>Session</th>
            <th>Amount</th>
            <th>Status</th>
            <th>Created</th>
          </tr>
        </thead>

        <tbody>
          {sessions.map(
            (session) => (
              <tr
                key={
                  session._id
                }
              >
                <td>
                  {
                    session.sessionId
                  }
                </td>

                <td>
                  {
                    session.amount
                  }
                </td>

                <td>
                  {
                    session.status
                  }
                </td>

                <td>
                  {new Date(
                    session.createdAt
                  ).toLocaleString()}
                </td>
              </tr>
            )
          )}
        </tbody>
      </table>
    </div>
  );
}