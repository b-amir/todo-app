import type React from "react";
import { Toaster } from "@/src/shared/components/ui/sonner";
import { Providers } from "@/src/app/providers";
import "./index.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="antialiased">
      <Providers>
        {children}
        <Toaster />
      </Providers>
    </div>
  );
}
