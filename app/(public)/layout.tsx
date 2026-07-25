/**
 * Layout envoltorio para las rutas públicas (fuera del dashboard).
 * Define el contenedor base y previene problemas de dimensiones mínimas.
 */
export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div style={{ minWidth: 320 }}>{children}</div>;
}
