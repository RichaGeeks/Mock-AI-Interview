// app/layout.js
import './globals.css';
import ClientProvider from './client-provider';

export const metadata = {
  title: 'MockAI Interview - Practice with AI',
  description: 'Practice interviews with AI and get instant feedback',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen">
        <ClientProvider>{children}</ClientProvider>
      </body>
    </html>
  );
}