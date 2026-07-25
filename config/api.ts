const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://192.168.18.221:3000";

export const API_CONFIG = {
  BASE_URL: API_BASE_URL,
  ENDPOINTS: {
    LOGIN: `${API_BASE_URL}/api/users/login`,
    REFRESH: `${API_BASE_URL}/api/users/refresh-token`,
    USERS: `${API_BASE_URL}/api/users`,
    USER_DETAIL: (id: string) => `${API_BASE_URL}/api/users/${id}`,
    USER_ROLES: (userId: string) =>
      `${API_BASE_URL}/api/app/roles/${userId}/users`,
    ROLES: `${API_BASE_URL}/api/app/roles`,
    ROLE_PERMISSIONS: (roleId: string) =>
      `${API_BASE_URL}/api/app/roles/${roleId}/permissions`,
    APP_PERMISSIONS: `${API_BASE_URL}/api/app/permissions`,
  },
};
