import assert from "node:assert/strict";
import test from "node:test";

import {
  clearMerchantSession,
  handleMerchantUnauthorized,
} from "../src/auth/merchantSession.js";

function storage(values = {}) {
  const data = new Map(Object.entries(values));
  return {
    getItem: (key) => data.get(key) ?? null,
    removeItem: (key) => data.delete(key),
    values: data,
  };
}

test("revoked merchant session clears only merchant state and redirects", () => {
  const local = storage({
    token: "merchant-token",
    user: "merchant-user",
    adminToken: "admin-token",
    adminUser: "admin-user",
  });
  const session = storage({ token: "session-token", user: "session-user" });
  let redirectedTo = null;

  handleMerchantUnauthorized({
    local,
    session,
    location: {
      pathname: "/merchant/dashboard",
      assign: (value) => { redirectedTo = value; },
    },
  });

  assert.equal(local.getItem("token"), null);
  assert.equal(local.getItem("user"), null);
  assert.equal(session.getItem("token"), null);
  assert.equal(session.getItem("user"), null);
  assert.equal(local.getItem("adminToken"), "admin-token");
  assert.equal(local.getItem("adminUser"), "admin-user");
  assert.equal(redirectedTo, "/merchant/login");
});

test("merchant login and admin pages do not enter redirect loops", () => {
  for (const pathname of ["/merchant/login", "/admin/transactions"]) {
    const local = storage({ token: "merchant-token", adminToken: "admin-token" });
    const session = storage();
    let redirects = 0;
    handleMerchantUnauthorized({
      local,
      session,
      location: { pathname, assign: () => { redirects += 1; } },
    });
    assert.equal(redirects, 0);
    assert.equal(local.getItem("adminToken"), "admin-token");
  }
});

test("clearMerchantSession never clears admin identity", () => {
  const local = storage({ token: "merchant", user: "user", adminToken: "admin" });
  const session = storage({ token: "merchant", user: "user" });
  clearMerchantSession(local, session);
  assert.equal(local.getItem("adminToken"), "admin");
});
