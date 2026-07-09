import Link from "next/link";
import { signOut } from "@/app/auth/actions";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="mx-auto flex min-h-screen w-full max-w-sm flex-col">
      <header className="flex items-center justify-between border-b border-neutral-200 px-4 py-3 dark:border-neutral-800">
        <Link
          href="/missions"
          className="text-sm font-semibold text-neutral-900 dark:text-neutral-50"
        >
          🌿 해초키우기
        </Link>
        <nav className="flex items-center gap-3 text-sm text-neutral-500 dark:text-neutral-400">
          <Link href="/missions">미션</Link>
          <Link href="/character">해초</Link>
          <form action={signOut}>
            <button
              type="submit"
              className="text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200"
            >
              로그아웃
            </button>
          </form>
        </nav>
      </header>
      <main className="flex-1">{children}</main>
    </div>
  );
}
