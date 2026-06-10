export const API_URL = "/api";

export const cleanPriceDisplay = (priceDisplay = "") =>
  priceDisplay.replace(/^\s*от\s+/i, "");

export const getToken = () => {
  const token = localStorage.getItem("token");
  return token && token !== "undefined" && token !== "null" ? token : "";
};

export const getAuthHeaders = () => {
  const token = getToken();

  const headers = {
    "Content-Type": "application/json",
  };

  if (token) {
    headers.Authorization = `Token ${token}`;
  }

  return headers;
};

export const getApiErrorMessage = async (response) => {
  try {
    const data = await response.json();

    if (data.detail) return data.detail;
    if (data.error) return data.error;

    const firstError = Object.values(data).flat()[0];
    return firstError || `HTTP ${response.status}`;
  } catch {
    return `HTTP ${response.status}`;
  }
};

export const apiRequest = async (path, options = {}) => {
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      ...getAuthHeaders(),
      ...(options.headers || {}),
    },
  });

  if (!response.ok) {
    throw new Error(await getApiErrorMessage(response));
  }

  if (response.status === 204) {
    return null;
  }

  return response.json();
};
