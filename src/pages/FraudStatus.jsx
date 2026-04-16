import { useEffect, useState } from "react";
import API from "../services/api";
import AlertBanner from "../components/AlertBanner";

export default function FraudStatus() {
  const [riskStatus, setRiskStatus] = useState(null);
  const [fraudLogs, setFraudLogs] = useState([]);

  async function loadRiskStatus() {
    try {
      const [riskRes, logsRes] = await Promise.all([
        API.get("/user/risk-status"),
        API.get("/wallet/fraud-logs"),
      ]);

      setRiskStatus(riskRes.data);
      setFraudLogs(logsRes.data || []);
    } catch (err) {
      console.log("Failed to load fraud status:", err.message);
    }
  }

  useEffect(() => {
    loadRiskStatus();
  }, []);

  return (
    <div style={wrapper}>
      <div style={card}>
        <h3 style={{ marginTop: 0 }}>Risk Status</h3>

        {riskStatus?.frozen ? (
          <AlertBanner
            message={`Account frozen until ${new Date(
              riskStatus.freezeUntil
            ).toLocaleString()}`}
            type="danger"
          />
        ) : (
          <AlertBanner
            message="Your account is active and able to make payments."
            type="success"
          />
        )}

        <p><strong>Fraud Count:</strong> {riskStatus?.fraudCount ?? 0}</p>
        <p><strong>Frozen:</strong> {riskStatus?.frozen ? "Yes" : "No"}</p>
      </div>

      <div style={card}>
        <h3 style={{ marginTop: 0 }}>Recent Fraud Logs</h3>

        {fraudLogs.length === 0 ? (
          <p style={{ color: "#666", margin: 0 }}>No fraud activity recorded.</p>
        ) : (
          fraudLogs.slice(0, 5).map((log) => (
            <div key={log._id} style={logBox}>
              <div>
                <strong>
                  {String(log.currency || "").toUpperCase()} {log.amount}
                </strong>
              </div>
              <div>Decision: {log.decision}</div>
              <div>Risk Score: {log.riskScore}</div>
              <div style={{ fontSize: 12, color: "#666" }}>
                {new Date(log.createdAt).toLocaleString()}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

const wrapper = {
  display: "grid",
  gap: 16,
};

const card = {
  border: "1px solid #ddd",
  borderRadius: 12,
  padding: 20,
  background: "#fff",
};

const logBox = {
  borderTop: "1px solid #eee",
  padding: "10px 0",
};