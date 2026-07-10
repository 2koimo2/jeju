import Image from "next/image";
import { CollectionTabs } from "./collection-tabs";

export default function CollectionLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex min-h-full flex-col">
      <div className="fixed inset-0 z-0 flex justify-center overflow-hidden">
        <div className="relative h-full w-full max-w-sm">
          <Image
            src="/collection/background.png"
            alt=""
            aria-hidden="true"
            fill
            unoptimized
            priority
            className="object-cover object-top"
          />
        </div>
      </div>
      <div className="relative z-10 flex flex-1 flex-col">
        <CollectionTabs />
        {children}
      </div>
    </div>
  );
}
