import './globals.css';
import { SearchProvider } from '@/components/sitecore-search/SearchProvider';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <SearchProvider>{children}</SearchProvider>
      </body>
    </html>
  );
}
