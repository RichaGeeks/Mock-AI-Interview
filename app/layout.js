// app/layout.js
import './globals.css';

export const metadata = {
  title: 'MockAI Interview - Practice with AI',
  description: 'Practice interviews with AI and get instant feedback',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen">
        {children}
      </body>
    </html>
  );
}