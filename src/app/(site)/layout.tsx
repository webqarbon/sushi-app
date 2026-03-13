import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CategoriesProvider from "@/components/CategoriesProvider";

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <CategoriesProvider>
      <Header />
      <main className="flex-1 shrink-0">
        {children}
      </main>
      <Footer />
    </CategoriesProvider>
  );
}
