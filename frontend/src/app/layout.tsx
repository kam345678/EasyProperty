<<<<<<< HEAD
import "../styles/globals.css"
import { AuthProvider } from "@/context/AuthContext"
=======
import "../styles/globals.css";

export const metadata = {
  title: "EasyProperty",
  description: "ระบบจัดการห้องพัก",
};
>>>>>>> 756f3ace5007c52251664ca907f92b20e68a6cb3

export default function RootLayout({
  children,
}: {
<<<<<<< HEAD
  children: React.ReactNode
=======
  children: React.ReactNode;
>>>>>>> 756f3ace5007c52251664ca907f92b20e68a6cb3
}) {
  // ย้ายคอมเมนต์มาไว้ตรงนี้แทนครับ
  return (
    <html lang="en" data-theme="light" style={{ colorScheme: 'light' }}>
      <body>
<<<<<<< HEAD
        <AuthProvider>
          {children}
        </AuthProvider>
=======
        {children}
>>>>>>> 756f3ace5007c52251664ca907f92b20e68a6cb3
      </body>
    </html>
  )
}