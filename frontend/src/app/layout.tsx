import "../styles/globals.css";

export const metadata = {
  title: "EasyProperty",
  description: "ระบบจัดการห้องพัก",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // ย้ายคอมเมนต์มาไว้ตรงนี้แทนครับ
  return (
    <html lang="en" data-theme="light" style={{ colorScheme: 'light' }}>
      <body>
        {children}
      </body>
    </html>
  );
}