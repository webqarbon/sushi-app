import Hero from "@/components/Hero";
import Catalog from "@/components/Catalog";
import { createClient } from "@/utils/supabase/server";
import { Category, Product } from "@/types/database";

export default async function Home() {
  const supabase = await createClient();

  // Fetch Categories
  const { data: categories } = await supabase
    .from("categories")
    .select("*")
    .order("order_index", { ascending: true });

  // Fetch Products
  const { data: products } = await supabase
    .from("products")
    .select("*");

  return (
    <div className="flex flex-col gap-12 pb-24">
      <Hero />
      
      <section id="catalog" className="container mx-auto px-4 sm:px-6 lg:px-8">
        <Catalog 
          categories={categories as Category[] || []} 
          products={products as Product[] || []} 
        />
      </section>
    </div>
  );
}
