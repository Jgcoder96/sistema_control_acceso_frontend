const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://192.168.0.183:3000";

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
    LOGS: `${API_BASE_URL}/api/firmware/logs`,
    UBICACIONES: `${API_BASE_URL}/api/firmware/locations`,
    UBICACION_DETAIL: (id: string) =>
      `${API_BASE_URL}/api/firmware/locations/${id}`,
    PUNTOS_ACCESO: `${API_BASE_URL}/api/firmware/access-points`,
    PUNTO_ACCESO_DETAIL: (id: string) =>
      `${API_BASE_URL}/api/firmware/access-points/${id}`,
    HORARIOS: `${API_BASE_URL}/api/firmware/schedules`,
    HORARIO_DETAIL: (id: string) =>
      `${API_BASE_URL}/api/firmware/schedules/${id}`,
    FESTIVOS: `${API_BASE_URL}/api/firmware/schedules/holidays`,
    FESTIVO_DETAIL: (id: string) =>
      `${API_BASE_URL}/api/firmware/schedules/holidays/${id}`,
    TARJETAS: `${API_BASE_URL}/api/firmware/cards`,
    TARJETAS_DETAIL: (id: string) => `${API_BASE_URL}/api/firmware/cards/${id}`,
    TARJETAS_ASSIGN: (id: string) =>
      `${API_BASE_URL}/api/firmware/cards/${id}/assign`,
    TARJETAS_RETURN: (id: string) =>
      `${API_BASE_URL}/api/firmware/cards/${id}/return`,
    TARJETAS_BLOCK: (id: string) =>
      `${API_BASE_URL}/api/firmware/cards/${id}/block`,
    TARJETAS_REACTIVATE: (id: string) =>
      `${API_BASE_URL}/api/firmware/cards/${id}/reactivate`,
    TARJETAS_LOST: (id: string) =>
      `${API_BASE_URL}/api/firmware/cards/${id}/lost`,
    TARJETAS_DELETE: (id: string) =>
      `${API_BASE_URL}/api/firmware/cards/${id}/delete`,
  },
};
