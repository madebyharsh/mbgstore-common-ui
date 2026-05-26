import type { Metadata } from 'next';
import { Providers } from '@/components/Providers';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import '@/styles/globals.css';

export const metadata: Metadata = {
  title: 'Inventory Management System',
  description: 'A simple inventory management application',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <ProtectedRoute>{children}</ProtectedRoute>
        </Providers>
      </body>
    </html>
  );
}
