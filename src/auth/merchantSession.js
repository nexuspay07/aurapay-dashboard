export function clearMerchantSession(local, session) {
  local.removeItem("token");
  local.removeItem("user");
  session.removeItem("token");
  session.removeItem("user");
}

export function handleMerchantUnauthorized({ local, session, location }) {
  clearMerchantSession(local, session);

  if (
    location &&
    location.pathname !== "/merchant/login" &&
    !location.pathname.startsWith("/admin")
  ) {
    location.assign("/merchant/login");
  }
}
