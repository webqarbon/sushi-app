import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CategoriesProvider from "@/components/CategoriesProvider";
import AddToCartFly from "@/components/AddToCartFly";

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <CategoriesProvider>
      <AddToCartFly />
      <Header />
      <main className="flex-1 shrink-0">
        {children}
      </main>
      <Footer />
    </CategoriesProvider>
  );
}
