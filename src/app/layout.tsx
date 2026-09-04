import type { Metadata } from 'next';
import './globals.css';
import Header from '@/components/Header';

export const metadata: Metadata = {
  title: 'Módulos - Repuestos de celulares',
  description: 'Módulos de pantallas para celulares Samsung, iPhone y más',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>
        <Header />
        <main className="mx-auto max-w-6xl px-4 py-8">{children}</main>
        <footer className="mt-16 border-t border-gray-200 py-8 text-center text-sm text-gray-500">
          © {new Date().getFullYear()} Módulos. Todos los derechos reservados.
        </footer>
      </body>
    </html>
  );
}
