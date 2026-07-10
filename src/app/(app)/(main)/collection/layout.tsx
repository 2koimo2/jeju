import Image from "next/image";
import { CollectionTabs } from "./collection-tabs";

export default function CollectionLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="isolate relative flex min-h-full flex-col">
      <div className="fixed inset-0 flex justify-center overflow-hidden">
        <div className="relative h-full w-full max-w-sm">
          <Image
            src="/collection/background.png"
            alt=""
            aria-hidden="true"
            fill
            priority
            sizes="384px"
            className="object-cover object-top"
          />
        </div>
      </div>
      <div className="relative flex flex-1 flex-col">
        <CollectionTabs />
        {children}
      </div>
    </div>
  );
}
