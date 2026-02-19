import { ReactNode } from "react";

export const metadata = {
  title: "EasyProperty",
  description: "Property Management System",
};

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <div className="flex h-screen">
          <div className="flex flex-1 flex-col">
            <main className="flex-1 overflow-y-auto p-6">
              {children}
            </main>
          </div>
        </div>
      </body>
    </html>
  );
}