import { Analytics } from "@vercel/analytics/react";
import { Toaster } from "@/components/ui/toaster";
import GlobalProvider from "@/components/contexts";
import "styles/globals.css";

export const metadata = {
  title: "Keycloak Kid",
  description: "Simple Keycloak UI for SaSS applications",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning className="h-full w-full">
      <body className="h-full w-full">
        <GlobalProvider>
          {children}
          <Toaster />
          <Analytics />
        </GlobalProvider>
      </body>
    </html>
  );
}
