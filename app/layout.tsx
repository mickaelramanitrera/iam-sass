import "styles/globals.css";

export const metadata = {
  title: "IAM SaSS - shadcn UI",
  description: "Next JS app",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full w-full">
      <body className="h-full w-full">{children}</body>
    </html>
  );
}
