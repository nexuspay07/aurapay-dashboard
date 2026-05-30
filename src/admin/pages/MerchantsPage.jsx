import {
  useEffect,
  useState,
} from "react";

import API from "../../services/api";

export default function MerchantsPage() {
  const [merchants, setMerchants] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  async function loadMerchants() {
    try {
      const res = await API.get(
        "/merchants"
      );

      setMerchants(res.data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  }

  async function verifyMerchant(
    id
  ) {
    try {
      await API.patch(
        `/merchants/${id}/verify`
      );

      loadMerchants();
    } catch (err) {
      console.log(err);
    }
  }

  async function rejectMerchant(
    id
  ) {
    try {
      await API.patch(
        `/merchants/${id}/reject`
      );

      loadMerchants();
    } catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
    loadMerchants();
  }, []);

  if (loading) {
    return (
      <div style={{ padding: 30 }}>
        Loading merchants...
      </div>
    );
  }

  return (
    <div>
      <h1
        style={{
          fontSize: 36,
          fontWeight: 800,
          marginBottom: 24,
        }}
      >
        Merchant Operations
      </h1>

      <div style={card}>
        <table style={table}>
          <thead>
            <tr>
              <th style={th}>
                Business
              </th>

              <th style={th}>
                Country
              </th>

              <th style={th}>
                Status
              </th>

              <th style={th}>
                Risk
              </th>

              <th style={th}>
                Actions
              </th>
            </tr>
          </thead>

          <tbody>
            {merchants.map(
              (merchant) => (
                <tr
                  key={
                    merchant._id
                  }
                >
                  <td style={td}>
                    {
                      merchant.businessName
                    }
                  </td>

                  <td style={td}>
                    {
                      merchant.country
                    }
                  </td>

                  <td style={td}>
                    {
                      merchant.verificationStatus
                    }
                  </td>

                  <td style={td}>
                    {
                      merchant.riskLevel
                    }
                  </td>

                  <td style={td}>
                    <button
                      style={
                        verifyButton
                      }
                      onClick={() =>
                        verifyMerchant(
                          merchant._id
                        )
                      }
                    >
                      Verify
                    </button>

                    <button
                      style={
                        rejectButton
                      }
                      onClick={() =>
                        rejectMerchant(
                          merchant._id
                        )
                      }
                    >
                      Reject
                    </button>
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
  border: "1px solid #e5e7eb",
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

const verifyButton = {
  border: "none",
  background: "#10b981",
  color: "#fff",
  padding: "8px 12px",
  borderRadius: 8,
  cursor: "pointer",
  marginRight: 8,
};

const rejectButton = {
  border: "none",
  background: "#ef4444",
  color: "#fff",
  padding: "8px 12px",
  borderRadius: 8,
  cursor: "pointer",
};