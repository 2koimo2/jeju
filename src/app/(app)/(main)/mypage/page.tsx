import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { requirePersona } from "@/lib/onboarding";
import { startOfKstDay, kstDateKey } from "@/lib/time";
import { levelForPoints } from "@/lib/character";
import { SPECIES_KEYS, SPECIES_DEFS, type SpeciesKey } from "@/lib/species";

type ProfileRow = { full_name: string; created_at: string };
type CharacterRow = { species: SpeciesKey | null; total_points: number };

const INFO_LINKS: { label: string; href?: string }[] = [
  { label: "결제 내역" },
  { label: "결제 수단 관리" },
  { label: "배송지 관리" },
  { label: "미션 기록", href: "/missions" },
  { label: "인증 내역" },
  { label: "기여도 리포트", href: "/report" },
];

function daysSince(iso: string): number {
  const start = startOfKstDay(new Date(iso)).getTime();
  const today = startOfKstDay(new Date()).getTime();
  return Math.floor((today - start) / 86_400_000) + 1;
}

export default async function MyPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  await requirePersona(supabase, user.id);

  const [
    { data: profile },
    { data: character },
    { count: completedMissions },
    { data: ledgerRows },
  ] = await Promise.all([
    supabase
      .from("profiles")
      .select("full_name, created_at")
      .eq("user_id", user.id)
      .single(),
    supabase
      .from("seaweed_characters")
      .select("species, total_points")
      .eq("user_id", user.id)
      .maybeSingle(),
    supabase
      .from("missions")
      .select("id", { count: "exact", head: true })
      .eq("user_id", user.id)
      .eq("status", "completed"),
    supabase.from("growth_ledger").select("created_at").eq("user_id", user.id),
  ]);

  const typedProfile = profile as ProfileRow;
  const typedCharacter = character as CharacterRow | null;
  const ownedSpecies = typedCharacter?.species ?? undefined;
  const speciesDef = ownedSpecies ? SPECIES_DEFS[ownedSpecies] : undefined;
  const avatarSrc = speciesDef?.cardImage ?? speciesDef?.image;
  const level = levelForPoints(typedCharacter?.total_points ?? 0).level;
  const missionDays = new Set(
    (ledgerRows as { created_at: string }[] | null ?? []).map((row) =>
      kstDateKey(new Date(row.created_at)),
    ),
  ).size;

  return (
    <>
      <div className="fixed inset-0 z-0 flex justify-center overflow-hidden">
        <div className="relative h-full w-full max-w-sm">
          <Image
            src="/mypage/hero-bg.png"
            alt=""
            fill
            unoptimized
            priority
            className="object-cover"
          />
        </div>
      </div>

      <div className="relative z-10 flex flex-col gap-4 px-4 pt-[26px] pb-10">
        <div className="flex items-center justify-between">
          <h1 className="font-korean text-[28px] font-bold text-black">
            마이페이지
          </h1>
          <Link
            href="/mypage/settings"
            className="flex size-[39px] items-center justify-center rounded-full bg-white shadow-[-2px_3px_4.1px_0px_rgba(0,127,133,0.15)]"
          >
            <Image
              src="/mypage/settings.svg"
              alt="설정"
              width={25}
              height={25}
              className="rotate-45"
            />
          </Link>
        </div>

        <div className="relative flex flex-col gap-6 rounded-[15px] bg-white p-4">
          <Link href="/character" className="flex items-center gap-4 pr-6">
            <div
              className="flex size-[100px] shrink-0 items-center justify-center overflow-hidden rounded-full"
              style={{ backgroundColor: speciesDef?.bannerColor ?? "#ffdce5" }}
            >
              {avatarSrc ? (
                <Image
                  src={avatarSrc}
                  alt=""
                  width={64}
                  height={64}
                  unoptimized
                  className="h-16 w-auto object-contain"
                />
              ) : (
                <span className="text-4xl">🌱</span>
              )}
            </div>
            <div className="flex flex-col gap-1.5">
              <p className="font-korean text-xl font-bold text-[#5b3717]">
                {typedProfile.full_name}
              </p>
              <p className="font-korean text-base text-[#b7ada4]">
                바다숲 키운지 {daysSince(typedProfile.created_at)}일째
              </p>
            </div>
            <Image
              src="/mypage/chevron.svg"
              alt=""
              width={24}
              height={24}
              className="absolute top-1/3 right-4 -rotate-90"
            />
          </Link>

          <div className="flex items-end justify-around">
            <StatTile
              icon="/mypage/mail.svg"
              label="수행한 미션수"
              value={completedMissions ?? 0}
            />
            <div className="h-16 w-px bg-[#eee6d8]" />
            <StatTile
              icon="/mypage/sea.svg"
              label="키운 해초수"
              value={level}
            />
            <div className="h-16 w-px bg-[#eee6d8]" />
            <StatTile
              icon="/mypage/calendar.svg"
              label="누적 미션일"
              value={missionDays}
            />
          </div>
        </div>

        <div className="rounded-[15px] bg-white p-4">
          <p className="font-korean text-base font-bold text-[#5b3717]">
            보유 해초
          </p>
          <div className="mt-4 flex justify-between gap-2">
            {SPECIES_KEYS.map((key) => {
              const def = SPECIES_DEFS[key];
              const owned = key === ownedSpecies;
              const icon = def?.cardImage ?? def?.image;

              return (
                <div
                  key={key}
                  className="flex flex-col items-center gap-2"
                >
                  <div className="flex size-11 items-center justify-center">
                    {icon ? (
                      <Image
                        src={icon}
                        alt=""
                        width={40}
                        height={40}
                        unoptimized
                        className={`h-11 w-auto object-contain ${owned ? "" : "opacity-40 grayscale"}`}
                      />
                    ) : (
                      <span
                        className={`text-3xl ${owned ? "" : "opacity-40 grayscale"}`}
                      >
                        🌿
                      </span>
                    )}
                  </div>
                  <span className="font-jeju text-sm text-[#644c0f]">
                    X{owned ? 1 : 0}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="rounded-[15px] bg-white p-4">
          <p className="font-korean text-base font-bold text-[#5b3717]">
            정보관리
          </p>
          <div className="font-korean mt-3 flex flex-col text-sm text-black">
            {INFO_LINKS.map((item) =>
              item.href ? (
                <Link key={item.label} href={item.href} className="py-1.5">
                  {item.label}
                </Link>
              ) : (
                <p key={item.label} className="py-1.5 text-[#978f88]">
                  {item.label}
                </p>
              ),
            )}
          </div>
        </div>
      </div>
    </>
  );
}

function StatTile({
  icon,
  label,
  value,
}: {
  icon: string;
  label: string;
  value: number;
}) {
  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex flex-col items-center gap-1">
        <Image src={icon} alt="" width={17} height={20} />
        <span className="font-korean text-sm text-[#8e837a]">{label}</span>
      </div>
      <span className="text-4xl font-semibold text-black">{value}</span>
    </div>
  );
}
