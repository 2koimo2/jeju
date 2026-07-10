"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

const TABS = [
  {
    href: "/missions",
    label: "나의 바당",
    active: "/tabbar/home-active.svg",
    inactive: "/tabbar/home-inactive.svg",
  },
  {
    href: "/collection",
    label: "도감",
    active: "/tabbar/book-active.svg",
    inactive: "/tabbar/book-inactive.svg",
  },
  {
    href: "/report",
    label: "리포트",
    active: "/tabbar/report-active.svg",
    inactive: "/tabbar/report-inactive.svg",
  },
  {
    href: "/mypage",
    label: "마이페이지",
    active: "/tabbar/profile-active.svg",
    inactive: "/tabbar/profile-inactive.svg",
  },
] as const;

export function BottomTabBar() {
  const pathname = usePathname();
  const activeIndex = TABS.findIndex(
    (tab) => pathname === tab.href || pathname.startsWith(`${tab.href}/`),
  );

  return (
    <nav
      className="fixed left-1/2 z-40 h-16 w-[334px] -translate-x-1/2 rounded-full border border-[rgba(226,231,237,0.4)] bg-[#f7eedd] p-1 drop-shadow-[0px_2px_2.25px_rgba(73,49,3,0.25)]"
      style={{
        bottom: "calc(1rem + env(safe-area-inset-bottom))",
      }}
    >
      <div className="relative grid h-full w-full grid-cols-4">
        {activeIndex >= 0 && (
          <div
            aria-hidden="true"
            className="absolute top-0 left-0 h-full w-1/4 rounded-full bg-[#7f5b3b] transition-transform duration-300 ease-out"
            style={{ transform: `translateX(${activeIndex * 100}%)` }}
          />
        )}

        {TABS.map(({ href, label, active: activeSrc, inactive: inactiveSrc }, i) => {
          const isActive = i === activeIndex;

          return (
            <Link
              key={href}
              href={href}
              className="relative flex flex-col items-center justify-center gap-1"
            >
              <Image
                src={isActive ? activeSrc : inactiveSrc}
                alt=""
                width={32}
                height={32}
                className="size-8 transition-opacity duration-200"
              />
              <span
                className={`font-korean text-[10px] leading-3 font-medium tracking-[-0.32px] whitespace-nowrap transition-colors duration-200 ${
                  isActive ? "text-[#f7eedd]" : "text-[#736559]"
                }`}
              >
                {label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
