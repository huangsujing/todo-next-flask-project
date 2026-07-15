import type { Metadata } from 'next';
import { Fraunces, Manrope } from 'next/font/google';
import AuthGuard from './auth-guard';
import './globals.css';

const fraunces = Fraunces({
  subsets: ['latin'],
  variable: '--font-fraunces',
  display: 'swap',
});

const manrope = Manrope({
  subsets: ['latin'],
  variable: '--font-manrope',
  display: 'swap',
});

export const metadata: Metadata = {
  title: '今日待办 · Daily',
  description: '一款专注于专注与完成的极简待办清单应用',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN" className={`${fraunces.variable} ${manrope.variable}`}>
      <body>
        <AuthGuard />
        {children}
      </body>
    </html>
  );
}
