// Thin REST client so the frontend can talk to an Express/MongoDB backend later.
// Set VITE_API_URL to point at the API (e.g. http://localhost:5000/api).

const BASE_URL = import.meta.env.VITE_API_URL ?? "/api";
const TOKEN_KEY = "educentre.token";

export function getToken() {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(TOKEN_KEY);
}

export function setToken(token) {
  if (typeof window === "undefined") return;
  if (token) window.localStorage.setItem(TOKEN_KEY, token);
  else window.localStorage.removeItem(TOKEN_KEY);
}

async function request(path, { method = "GET", body, headers = {} } = {}) {
  const token = getToken();
  const response = await fetch(`${BASE_URL}${path}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || `Request failed with ${response.status}`);
  }
  return response.status === 204 ? null : response.json();
}

export const api = {
  get: (path) => request(path),
  post: (path, body) => request(path, { method: "POST", body }),
  put: (path, body) => request(path, { method: "PUT", body }),
  patch: (path, body) => request(path, { method: "PATCH", body }),
  del: (path) => request(path, { method: "DELETE" }),
};

// Endpoint map the backend should implement.
export const endpoints = {
  login: "/auth/login",
  register: "/auth/register",
  me: "/auth/me",
  students: "/students",
  teachers: "/teachers",
  courses: "/courses",
  batches: "/batches",
  attendance: "/attendance",
  fees: "/fees",
  materials: "/materials",
  announcements: "/announcements",
  reports: "/reports",
};
