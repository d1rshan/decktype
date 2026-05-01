const getBackendUrl = () => {
  if (import.meta.env.PROD) {
    return window.location.origin;
  }

  return "";
};

export const backendUrl = getBackendUrl();

export const apiBaseUrl = `${backendUrl}/api`;
