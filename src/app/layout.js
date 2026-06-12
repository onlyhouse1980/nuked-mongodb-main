import '@/lib/react-compat';
import 'bootstrap-css-only/css/bootstrap.min.css';
import '../styles/globals.css';
import '../css/customcss.css';
import '../components/Marquee.scss';
import '@fortawesome/fontawesome-svg-core/styles.css';
import Navbar from '../components/NavBar';
import Footer from '../components/Footer';

import { Providers } from './providers';

export const metadata = {
  title: 'Orchard Beach Community Group',
  description:
    'Community water usage, billing, and organizational resources for the Orchard Beach Community Group.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
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
