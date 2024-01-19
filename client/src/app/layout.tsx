// src/app/layout.tsx
import React from 'react';
import type { ReactNode } from 'react';
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
      </body>
    </html>
  );
};

export default Layout;
