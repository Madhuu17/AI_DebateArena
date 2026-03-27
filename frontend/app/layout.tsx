import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'AI Debate Arena — Multi-Agent AI Debate System',
  description: 'Watch intelligent AI agents debate any topic across 3 structured rounds with real-time evidence verification, fallacy detection, and argument scoring.',
  keywords: 'AI debate, multi-agent, argument analysis, fact-checking, AI system',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className} style={{ background: 'var(--bg-primary)' }}>
        {children}
      </body>
    </html>
  );
}
