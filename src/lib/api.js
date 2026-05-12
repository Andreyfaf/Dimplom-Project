const API_PREFIX = "/api";

async function request(path, options = {}) {
  const response = await fetch(`${API_PREFIX}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(options.token ? { Authorization: `Token ${options.token}` } : {}),
      ...options.headers,
    },
    method: options.method || "GET",
    body: options.body ? JSON.stringify(options.body) : undefined,
  });

  if (response.status === 204) {
    return null;
  }

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const firstValue = Object.values(data)[0];
    const message =
      data.detail ||
      data.non_field_errors?.[0] ||
      (Array.isArray(firstValue) ? firstValue[0] : firstValue) ||
      "Не удалось выполнить запрос.";
    throw new Error(message);
  }

  return data;
}

export function fetchBootstrap() {
  return request("/bootstrap/");
}

export function registerUser(payload) {
  return request("/auth/register/", {
    method: "POST",
    body: payload,
  });
}

export function loginUser(payload) {
  return request("/auth/login/", {
    method: "POST",
    body: payload,
  });
}

export function logoutUser(token) {
  return request("/auth/logout/", {
    method: "POST",
    token,
  });
}

export function fetchProfile(token) {
  return request("/auth/profile/", { token });
}

export function fetchCart(token) {
  return request("/cart/", { token });
}

export function addCartItem(token, productId, quantity = 1) {
  return request("/cart/items/", {
    method: "POST",
    token,
    body: { product_id: productId, quantity },
  });
}

export function removeCartItem(token, cartItemId) {
  return request(`/cart/items/${cartItemId}/`, {
    method: "DELETE",
    token,
  });
}

export function clearCartItems(token) {
  return request("/cart/clear/", {
    method: "DELETE",
    token,
  });
}

export function fetchOrders(token) {
  return request("/orders/", { token });
}

export function createOrder(token, payload) {
  return request("/orders/", {
    method: "POST",
    token,
    body: payload,
  });
}

export function createRepairRequest(token, payload) {
  return request("/repair-requests/", {
    method: "POST",
    token,
    body: payload,
  });
}
