export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-neutral-100 p-6 font-sans dark:bg-neutral-900">
      <div className="relative flex h-[874px] w-[402px] max-w-full flex-col overflow-hidden rounded-[2.5rem] border border-neutral-200 bg-white shadow-xl dark:border-neutral-800 dark:bg-neutral-950">
        <main className="flex flex-1 flex-col items-center justify-center gap-2 px-6 text-center">
          <p className="text-sm font-medium text-neutral-400 dark:text-neutral-600">
            402 × 874
          </p>
          <h1 className="text-lg font-semibold text-neutral-900 dark:text-neutral-50">
            여기에 화면을 디자인하세요
          </h1>
        </main>
      </div>
    </div>
  );
}
