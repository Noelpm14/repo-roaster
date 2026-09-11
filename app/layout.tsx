export const metadata = {
  title: 'Repo Roaster',
  description: 'Humiliate your codebase.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body style={{ margin: 0, padding: 0, backgroundColor: "#0e0e10", color: "#f4f4f5" }}>
        {children}
      </body>
    </html>
  );
}
