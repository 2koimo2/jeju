import { BottomTabBar } from "./bottom-tab-bar";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="mx-auto flex min-h-screen w-full max-w-sm flex-col">
      <main
        className="flex-1"
        style={{ paddingBottom: "calc(6rem + env(safe-area-inset-bottom))" }}
      >
        {children}
      </main>
      <BottomTabBar />
    </div>
  );
}
