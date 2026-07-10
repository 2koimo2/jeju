import Image from "next/image";

const CHARACTERS = [
  { src: "/loading/tot.png", width: 292, height: 447 },
  { src: "/loading/umut.png", width: 344, height: 434 },
  { src: "/loading/green.png", width: 378, height: 523 },
];

export function LoadingScreen({ overlay = false }: { overlay?: boolean }) {
  return (
    <div
      className={`relative flex flex-col items-center justify-center bg-[#f7eedd] px-6 ${
        overlay ? "fixed inset-0 z-50" : "min-h-screen"
      }`}
    >
      <div className="flex items-end gap-3">
        {CHARACTERS.map((character, index) => (
          <Image
            key={character.src}
            src={character.src}
            alt=""
            aria-hidden="true"
            width={character.width}
            height={character.height}
            className="h-[47px] w-auto animate-bounce-lg"
            style={{ animationDelay: `${index * 150}ms` }}
          />
        ))}
      </div>

      <p className="font-jeju mt-4 text-[36px] font-bold text-[#644c0f]">
        로딩중...
      </p>

      <div className="absolute right-0 bottom-16 left-0 flex flex-col items-center gap-2 px-6">
        <p className="font-jeju text-[18px] text-[#262321]">Tip</p>
        <p className="font-jeju text-center text-[13px] leading-[21px] text-[#262321]">
          제주 바당에는 500종이 넘는 해조류가 살고 있수다.
        </p>
      </div>
    </div>
  );
}
