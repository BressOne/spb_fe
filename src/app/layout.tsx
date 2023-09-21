import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";
import { Providers } from "@/providers";

export const metadata = {
  title: "A.M. Rest manager",
  description: "A.M. Rest manager",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <Header />
          {children}
          <Footer />
        </Providers>{" "}
      </body>
    </html>
  );
}
