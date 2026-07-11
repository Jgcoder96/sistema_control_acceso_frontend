export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div style={{ minWidth: 320 }}>{children}</div>;
}
