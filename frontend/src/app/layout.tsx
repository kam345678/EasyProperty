import "../styles/globals.css"
import { AuthProvider } from "@/context/AuthContext"

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // ย้ายคอมเมนต์มาไว้ตรงนี้แทนครับ
  return (
    <html lang="en" data-theme="light" style={{ colorScheme: 'light' }}>
      <body>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  )
}