<<<<<<< HEAD
import "../styles/globals.css";

export const metadata = {
  title: "EasyApartment",
  description: "ระบบจัดการห้องพัก",
};
=======
import "../styles/globals.css"
import { AuthProvider } from "@/context/AuthContext"
>>>>>>> f08fcb8e40c3d5fd6275bde0ff62fa9c97b1daea

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