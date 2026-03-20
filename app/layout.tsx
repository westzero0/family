// app/layout.tsx
import "./globals.css"; // 이 줄이 반드시 맨 위에 있어야 합니다!

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body className="antialiased">{children}</body>
    </html>
  );
}
