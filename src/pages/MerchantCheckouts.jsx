import { useEffect, useState } from "react";
import API from "../services/api";

export default function MerchantCheckouts() {
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

      setSessions(res.data);
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <div style={page}>
      <h1 style={title}>
        Checkout Management
      </h1>

      <p style={subtitle}>
        View and manage checkout
        sessions created through
        AuraPay.
      </p>

      <div style={tableCard}>
        <table
          style={table}
        >
          <thead>
            <tr>
              <th>Session</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Link</th>
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
                    $
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
                    <a
                      href={`/pay/${session.sessionId}`}
                      target="_blank"
                    >
                      Open
                    </a>
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
  fontSize: 38,
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