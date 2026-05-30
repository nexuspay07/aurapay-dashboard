import { useEffect, useState } from "react";

import API from "../../services/api";

export default function MerchantKYBPage() {
  const [merchants, setMerchants] =
    useState([]);

  async function loadKYB() {
    const res = await API.get(
      "/merchants"
    );

    setMerchants(
      res.data.filter(
        (m) => m.kybSubmitted
      )
    );
  }

  async function verifyMerchant(
    id
  ) {
    await API.patch(
      `/merchants/${id}/verify`
    );

    loadKYB();
  }

  useEffect(() => {
    loadKYB();
  }, []);

  return (
    <div>
      <h1
        style={{
          fontSize: 34,
          fontWeight: 800,
          marginBottom: 24,
        }}
      >
        Merchant KYB Center
      </h1>

      {merchants.map(
        (merchant) => (
          <div
            key={merchant._id}
            style={card}
          >
            <h2>
              {
                merchant.businessName
              }
            </h2>

            <p>
              Owner:
              {" "}
              {
                merchant.ownerName
              }
            </p>

            <p>
              Registration:
              {" "}
              {
                merchant.businessRegistrationNumber
              }
            </p>

            <p>
              Tax:
              {" "}
              {
                merchant.taxNumber
              }
            </p>

            <p>
              Status:
              {" "}
              {
                merchant.verificationStatus
              }
            </p>

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
              Approve KYB
            </button>
          </div>
        )
      )}
    </div>
  );
}

const card = {
  background: "#fff",
  padding: 24,
  borderRadius: 16,
  border: "1px solid #e5e7eb",
  marginBottom: 20,
};

const verifyButton = {
  border: "none",
  background: "#10b981",
  color: "#fff",
  padding: "10px 14px",
  borderRadius: 8,
  cursor: "pointer",
};