const LOCAL_BACKEND_URL = "http://localhost:3000";

const getBackendUrl = () => {
  const configured = import.meta.env.VITE_BACKEND_URL?.trim();

  if (configured) {
    return configured.replace(/\/+$/, "");
  }

  if (import.meta.env.PROD) {
    return window.location.origin;
  }

  return LOCAL_BACKEND_URL;
};

export const backendUrl = getBackendUrl();

export const apiBaseUrl = `${backendUrl}/api`;
