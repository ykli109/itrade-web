import ContactWidget from "@/components/ContactWidget";
import Navigation from "@/components/Navigation";
import "./globals.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh">
      <body>
        <div className="min-h-screen bg-gray-50">
          <Navigation />
          <main className="ml-44 p-4">{children}</main>
          <ContactWidget />
        </div>
      </body>
    </html>
  );
}
