const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000";

export const API_CONFIG = {
  BASE_URL: API_BASE_URL,
  ENDPOINTS: {
    LOGIN: `${API_BASE_URL}/api/users/login`,
    USERS: `${API_BASE_URL}/api/users`,
    USER_DETAIL: (id: string) => `${API_BASE_URL}/api/users/${id}`,
    USER_ROLES: (userId: string) => `${API_BASE_URL}/api/app/roles/${userId}/users`,
    ROLES: `${API_BASE_URL}/api/app/roles`,
  },
};
