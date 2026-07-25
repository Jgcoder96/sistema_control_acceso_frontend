import { API_CONFIG } from "@/config/api";
import { logout } from "./auth";

/** Opciones extendidas para la función fetch nativa */
type RequestOptions = RequestInit & {
  /** 
   * Bandera opcional para omitir la inyección automática del token de acceso 
   * (útil para endpoints de login o públicos)
   */
  skipAuth?: boolean;
};

/**
 * Envoltorio centralizado para peticiones de red (Fetch API).
 * Inyecta automáticamente el token JWT de acceso (`access_token`) en las cabeceras.
 * Si recibe un error 401 (No Autorizado), intenta renovar el token usando el `refresh_token`
 * y reintenta la petición original. Si la renovación falla, cierra la sesión.
 */
export async function apiFetch(
  input: string,
  init?: RequestOptions,
): Promise<Response> {
  const options: RequestOptions = init ? { ...init } : {};

  // Ensure headers object exists
  const headers = new Headers(options.headers || {});

  // Attach Authorization header unless explicitly skipped
  if (!options.skipAuth) {
    const accessToken = localStorage.getItem("access_token");
    if (accessToken) {
      headers.set("Authorization", `Bearer ${accessToken}`);
    }
  }

  // Apply modified headers back to options
  options.headers = headers;

  // First request
  let response = await fetch(input, options);

  // If unauthorized, try to refresh token
  if (response.status === 401 && !options.skipAuth) {
    const refreshToken = localStorage.getItem("refresh_token");
    if (!refreshToken) {
      logout();
      return response; // return original 401 response after logout
    }

    try {
      const refreshRes = await fetch(API_CONFIG.ENDPOINTS.REFRESH, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token: refreshToken }),
        skipAuth: true,
      } as RequestOptions);

      if (!refreshRes.ok) {
        logout();
        return response;
      }

      const refreshData = await refreshRes.json();
      if (refreshData.success && refreshData.data?.access_token) {
        const access = refreshData.data.access_token;
        localStorage.setItem("access_token", access);
        // Retry original request with new access token
        headers.set("Authorization", `Bearer ${access}`);
        options.headers = headers;
        response = await fetch(input, options);
      } else {
        logout();
      }
    } catch (e) {
      console.error("Token refresh failed", e);
      logout();
    }
  }

  return response;
}
