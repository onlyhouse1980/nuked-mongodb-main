import '@/lib/react-compat';
import '../styles/main-bundle.scss';
import Navbar from '../components/NavBar';
import Footer from '../components/Footer';

import { Providers } from './providers';

export const metadata = {
  title: 'Orchard Beach Community Group',
  description:
    'Community water usage, billing, and organizational resources for the Orchard Beach Community Group.',
};

import { Roboto } from 'next/font/google';

const roboto = Roboto({
  weight: ['300', '400', '500', '700'],
  subsets: ['latin'],
  display: 'swap',
});

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={roboto.className}>
      <body>
        <Navbar />
        <Providers>
          <main className="app-content">{children}</main>
        </Providers>
        <Footer />
      </body>
    </html>
  );
}
