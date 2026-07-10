import Image from "next/image";
import { CollectionTabs } from "./collection-tabs";

export default function CollectionLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="isolate relative flex min-h-full flex-col bg-[#f7eedd]">
      <div className="absolute inset-x-0 top-0 z-0 h-[210px] overflow-hidden">
        <Image
          src="/collection/background.png"
          alt=""
          aria-hidden="true"
          fill
          priority
          sizes="384px"
          className="object-cover"
        />
      </div>
      <div className="relative z-10 flex flex-1 flex-col">
        <CollectionTabs />
        {children}
      </div>
    </div>
  );
}
