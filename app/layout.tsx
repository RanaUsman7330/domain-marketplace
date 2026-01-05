import type { Metadata } from 'next';
import { CartProvider } from '../contexts/CartContext';  // Original import add kiya
import { getConnection } from '../lib/mysql-db';

export async function generateMetadata({ pathname }: { pathname: string }): Promise<Metadata> {
  try {
    const connection = getConnection();
    const [rows] = await connection.execute('SELECT * FROM seo_settings WHERE page = ?', [pathname]);
    const seo = rows[0] as any;
    return {
      title: seo?.title || 'Domain Marketplace',
      description: seo?.description || 'Buy and sell domains',
      keywords: seo?.keywords || 'domains',
      robots: seo?.robots || 'index,follow',
    };
  } catch {
    return { title: 'Domain Marketplace' };
  }
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <CartProvider>  {/* Yeh add kiya – ab useCart work karega */}
          {children}
        </CartProvider>
      </body>
    </html>
  );
}