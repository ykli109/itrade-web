import ContactWidget from '@/components/ContactWidget';
import Navigation from '@/components/Navigation';
import './globals.css';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh">
      <body>
        <div className="flex min-h-screen bg-gray-50">
          <Navigation />
          <main className="flex-1 p-8">
            {children}
          </main>
          <ContactWidget />
        </div>
      </body>
    </html>
  );
}