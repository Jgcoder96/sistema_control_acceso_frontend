/**
 * Función de utilidad para cerrar la sesión del usuario.
 * Limpia los tokens de autenticación y los datos del usuario del almacenamiento local,
 * para luego forzar una redirección a la pantalla de inicio de sesión.
 */
export function logout() {
  // Clear stored auth data
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
  localStorage.removeItem('user_data');

  // Optionally clear other cached data here

  // Redirect to login page
  if (typeof window !== 'undefined') {
    window.location.href = '/login';
  }
}
