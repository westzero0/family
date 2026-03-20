import "./globals.css"; // CSS 파일이 없다면 이 줄은 지우셔도 됩니다.

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
