"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function CollectionTabs() {
  const pathname = usePathname();
  const isShop = pathname.startsWith("/collection/shop");

  return (
    <div className="flex items-center gap-[15px] px-4 pt-5 pb-2">
      <Link
        href="/collection"
        className={`font-korean text-[36px] font-bold transition-colors ${
          isShop ? "text-[#00b1b1]" : "text-black"
        }`}
      >
        저장고
      </Link>
      <Link
        href="/collection/shop"
        className={`font-korean text-[36px] font-bold transition-colors ${
          isShop ? "text-black" : "text-[#00b1b1]"
        }`}
      >
        상점
      </Link>
    </div>
  );
}
