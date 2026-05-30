import { useState } from "react";
import { useNavigate } from "react-router-dom";

import API from "../../services/api";

export default function MerchantRegister() {
  const navigate = useNavigate();

  const [form, setForm] =
    useState({
      businessName: "",
      legalName: "",
      businessType:
        "corporation",
      contactEmail: "",
      country: "Canada",

      ownerEmail: "",
      password: "",
    });

  async function submit(e) {
    e.preventDefault();

    try {
      await API.post(
        "/merchants/register",
        form
      );

      alert(
        "Merchant created successfully"
      );

      navigate(
        "/merchant/login"
      );
    } catch (err) {
      console.log(err);

      alert(
        err?.response?.data
          ?.error ||
          "Registration failed"
      );
    }
  }

  return (
    <div style={container}>
      <form
        style={card}
        onSubmit={submit}
      >
        <h1>
          Create Merchant Account
        </h1>

        <input
          style={input}
          placeholder="Business Name"
          value={
            form.businessName
          }
          onChange={(e) =>
            setForm({
              ...form,
              businessName:
                e.target.value,
            })
          }
        />

        <input
          style={input}
          placeholder="Legal Name"
          value={form.legalName}
          onChange={(e) =>
            setForm({
              ...form,
              legalName:
                e.target.value,
            })
          }
        />

        <input
          style={input}
          placeholder="Business Email"
          value={
            form.contactEmail
          }
          onChange={(e) =>
            setForm({
              ...form,
              contactEmail:
                e.target.value,
            })
          }
        />

        <input
          style={input}
          placeholder="Owner Email"
          value={form.ownerEmail}
          onChange={(e) =>
            setForm({
              ...form,
              ownerEmail:
                e.target.value,
            })
          }
        />

        <input
          style={input}
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={(e) =>
            setForm({
              ...form,
              password:
                e.target.value,
            })
          }
        />

        <button
          style={button}
          type="submit"
        >
          Create Merchant
        </button>
      </form>
    </div>
  );
}

const container = {
  minHeight: "100vh",
  display: "grid",
  placeItems: "center",
  background: "#f3f4f6",
};

const card = {
  width: 500,
  background: "#fff",
  padding: 30,
  borderRadius: 20,
};

const input = {
  width: "100%",
  padding: 14,
  marginBottom: 12,
  boxSizing: "border-box",
};

const button = {
  width: "100%",
  padding: 14,
  border: "none",
  background: "#111827",
  color: "#fff",
  cursor: "pointer",
};