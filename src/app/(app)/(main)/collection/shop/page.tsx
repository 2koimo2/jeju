import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { requirePersona } from "@/lib/onboarding";
import { SPECIES_KEYS, type SpeciesKey } from "@/lib/species";
import { getProductsBySpecies } from "@/lib/products";
import { CategoryPills } from "./category-pills";
import { ProductCard } from "./product-card";

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<{ species?: string }>;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  await requirePersona(supabase, user.id);

  const { species } = await searchParams;
  const activeSpecies = (SPECIES_KEYS as readonly string[]).includes(
    species ?? "",
  )
    ? (species as SpeciesKey)
    : undefined;
  const products = getProductsBySpecies(activeSpecies);

  return (
    <div className="flex flex-col">
      <CategoryPills active={activeSpecies} />
      <div className="min-h-[600px] rounded-t-[15px] bg-[#f7eedd] px-4 pt-[28px] pb-6">
        <div className="grid grid-cols-2 gap-x-[23px] gap-y-[27px]">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
}
