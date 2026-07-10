"use client";

import Image from "next/image";
import Link from "next/link";
import { useFitScale } from "@/hooks/use-fit-scale";
import type { BackdropLayer, SpeciesDef } from "@/lib/species";

const DESIGN_WIDTH = 402;
const DESIGN_HEIGHT = 1072;

function HeroBackdrop({
  layer,
  src,
  alt,
}: {
  layer: BackdropLayer;
  src: string;
  alt: string;
}) {
  return (
    <Image
      src={src}
      alt={alt}
      width={layer.width}
      height={layer.height}
      aria-hidden={alt === "" ? true : undefined}
      className="absolute object-cover"
      style={{
        top: layer.top,
        left: layer.left,
        width: layer.width,
        height: layer.height,
        opacity: layer.opacity ?? 1,
        transform: `rotate(${layer.rotate}deg)${layer.flipY ? " scaleY(-1)" : ""}`,
      }}
    />
  );
}

export function SurveyResultContent({
  speciesDef,
}: {
  speciesDef: SpeciesDef;
}) {
  const scale = useFitScale(DESIGN_WIDTH);

  return (
    <div className="w-full bg-[#f7eedd]">
      {/* Reserves the correctly-scaled box in document flow so the page scrolls
          naturally instead of the fixed-size layout below overflowing/cropping. */}
      <div
        className="relative mx-auto"
        style={{ width: DESIGN_WIDTH * scale, height: DESIGN_HEIGHT * scale }}
      >
        <div
          className="absolute top-0 left-0 h-[1072px] w-[402px] origin-top-left"
          style={{ transform: `scale(${scale})` }}
        >
          <div
            className="absolute top-[-6px] left-[-21.8px] h-[312px] w-[445px] overflow-hidden"
            style={{ backgroundColor: speciesDef.bannerColor }}
          >
            <HeroBackdrop
              layer={speciesDef.heroBackdrop.faded}
              src={speciesDef.image}
              alt=""
            />
            <HeroBackdrop
              layer={speciesDef.heroBackdrop.visible}
              src={speciesDef.image}
              alt={speciesDef.name}
            />

            <p className="absolute top-[160.74px] left-[41.64px] text-base font-medium whitespace-nowrap text-[#4d433b]">
              나의 환경보호 해초 유형은?
            </p>
            <p className="absolute top-[206.6px] left-[41.64px] w-[300px] text-2xl leading-[1.2] font-bold whitespace-nowrap text-[#262321]">
              {speciesDef.tagline}
            </p>
            <p className="absolute top-[247.6px] left-[41.64px] font-jeju text-[48px] leading-none whitespace-nowrap text-[#644c0f]">
              {speciesDef.name}
            </p>
          </div>

          <p className="absolute top-[323.47px] left-[16.14px] w-[369.72px] text-lg leading-[31px] text-black">
            {speciesDef.description}
          </p>

          <div className="absolute top-[473px] left-[15.7px] flex w-[370px] flex-col gap-[10px] rounded-[15px] bg-white p-[10px]">
            <p className="px-[11px] text-[15px] font-bold text-black">
              {speciesDef.name} 유형은 이런 특징이 있어요!
            </p>
            <ul className="flex flex-col">
              {speciesDef.traits.map((trait) => (
                <li
                  key={trait.text}
                  className="ms-[30px] list-disc text-xl leading-[34px] font-bold text-black"
                >
                  {trait.emoji} {trait.text}
                </li>
              ))}
            </ul>
          </div>

          <div className="absolute top-[701.25px] left-[16.14px] w-[369.72px] text-lg leading-[31px] text-black">
            <p>이러한 당신을 응원하기 위해 첫 선물로</p>
            <p>{speciesDef.name} 포자를 드릴게요!</p>
            <p>{speciesDef.giftClosing}</p>
          </div>

          <div className="absolute top-[804px] left-[15.7px] flex h-[143px] w-[133px] flex-col items-center justify-center gap-1 rounded-[15px] bg-white">
            <Image
              src={speciesDef.cardImage ?? speciesDef.image}
              alt={speciesDef.name}
              width={67}
              height={85}
              className="h-[85px] w-[67px] object-contain"
            />
            <p className="font-jeju text-base text-[#7f5b3b]">Lv.0</p>
          </div>

          <Link
            href="/character"
            className="absolute top-[974px] left-[16px] flex h-16 w-[370px] items-center justify-center rounded-[15px] bg-[#7f5b3b] text-xl font-bold text-white"
          >
            {speciesDef.name} 키우러가기
          </Link>
        </div>
      </div>
    </div>
  );
}
