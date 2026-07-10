import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { requirePersona } from "@/lib/onboarding";
import { PERSONA_DEFS } from "@/lib/persona";
import { SPECIES_DEFS, type SpeciesKey } from "@/lib/species";

export default async function SurveyResultPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const persona = await requirePersona(supabase, user.id);

  const { data: character } = await supabase
    .from("seaweed_characters")
    .select("species")
    .eq("user_id", user.id)
    .maybeSingle();

  const species = character?.species as SpeciesKey | undefined;
  const speciesDef = species ? SPECIES_DEFS[species] : undefined;
  if (!speciesDef) redirect("/survey");

  const personaDef = PERSONA_DEFS[persona.persona_key];

  return (
    <div className="flex min-h-screen flex-col bg-[#f7eedd]">
      <div
        className="relative flex items-end justify-end overflow-hidden px-6 pt-10 pb-6"
        style={{ backgroundColor: speciesDef.bannerColor }}
      >
        <div className="mr-auto max-w-[220px]">
          <p className="text-base font-medium text-[#4d433b]">
            나의 환경보호 해초 유형은?
          </p>
          <p className="mt-2 text-2xl font-bold text-[#262321]">
            {speciesDef.tagline}
          </p>
          <p className="mt-1 font-jeju text-[48px] leading-none text-[#644c0f]">
            {speciesDef.name}
          </p>
        </div>
        <Image
          src={speciesDef.image}
          alt={speciesDef.name}
          width={160}
          height={200}
          className="h-auto w-[140px] shrink-0 object-contain"
          priority
        />
      </div>

      <div className="flex flex-1 flex-col gap-6 px-4 py-6">
        <p className="text-lg whitespace-pre-wrap text-neutral-900">
          {speciesDef.description}
        </p>

        <div className="flex flex-col gap-3 rounded-2xl bg-white p-4 shadow-sm">
          <p className="text-sm font-bold text-neutral-900">
            {speciesDef.name} 유형은 이런 특징이 있어요!
          </p>
          <ul className="flex flex-col gap-2">
            {speciesDef.traits.map((trait) => (
              <li
                key={trait.text}
                className="flex items-center gap-2 text-base text-neutral-900"
              >
                <span>{trait.emoji}</span>
                <span>{trait.text}</span>
              </li>
            ))}
          </ul>
        </div>

        <p className="text-lg text-neutral-900">
          이러한 당신을 응원하기 위해 첫 선물로
          <br />
          {speciesDef.name}포자를 드릴게요!
          <br />
          소중히 키워 제주의 바다를 지켜주세요.
        </p>

        <p className="text-sm text-neutral-500">
          {personaDef.label} 유형 — {personaDef.description}
        </p>

        <div className="flex w-[133px] flex-col items-center gap-1 rounded-2xl bg-white p-3 shadow-sm">
          <Image
            src={speciesDef.cardImage ?? speciesDef.image}
            alt={speciesDef.name}
            width={67}
            height={85}
            className="h-[85px] w-[67px] object-contain"
          />
          <p className="font-jeju text-base text-[#7f5b3b]">Lv.0</p>
        </div>
      </div>

      <div className="sticky bottom-0 bg-[#f7eedd] px-4 py-4">
        <Link
          href="/character"
          className="flex h-16 w-full items-center justify-center rounded-2xl bg-[#7f5b3b] text-xl font-bold text-white"
        >
          {speciesDef.name} 키우러가기
        </Link>
      </div>
    </div>
  );
}
