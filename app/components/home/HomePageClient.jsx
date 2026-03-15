"use client";

import { useMemo } from "react";
import { useProductos } from "../../store/productosStore";
import HeroSection from "./HeroSection";
import FeaturedProductsSection from "./FeaturedProductsSection";
import BenefitsSection from "./BenefitsSection";
import PromoBanner from "./PromoBanner";
import HomeFooter from "./HomeFooter";

export default function HomePageClient() {
  const productos = useProductos((state) => state.productos || []);

  const productosDestacados = useMemo(() => {
    if (!Array.isArray(productos)) return [];
    return [...productos]
      .filter((p) => p?.id && p?.imagen && p.id !== 39) // Excluir el producto destacado del hero
      .sort((a, b) => (b.descuento || 0) - (a.descuento || 0))
      .slice(0, 4);
  }, [productos]);

  return (
    <main className="min-h-screen bg-white dark:bg-zinc-950 text-zinc-900 dark:text-white">
      <HeroSection />
      <FeaturedProductsSection products={productosDestacados} />
      <BenefitsSection />
      <PromoBanner />
      <HomeFooter />
    </main>
  );
}
