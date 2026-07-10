import Image from "next/image";
import { MAX_TEMP_C, MIN_TEMP_C } from "@/lib/seaweed-growth";

function pickGaugeMessage(tempC: number): string {
  if (tempC < 20) return "해초가 자라기 좋은 온도에요~";
  if (tempC < 30) return "조금 더워하는 것 같아요";
  return "너무 더워서 힘들어해요";
}

export function TemperatureGauge({ temperatureC }: { temperatureC: number }) {
  const clamped = Math.min(MAX_TEMP_C, Math.max(MIN_TEMP_C, temperatureC));
  const fraction = (clamped - MIN_TEMP_C) / (MAX_TEMP_C - MIN_TEMP_C);

  return (
    <div className="rounded-[15px] bg-white px-4 py-5">
      <p className="font-korean text-center text-[20px] font-semibold text-black">
        {pickGaugeMessage(clamped)}
      </p>

      <div className="relative mt-6">
        <div
          className="h-6 w-full rounded-full shadow-[inset_0px_4px_4px_0px_rgba(0,0,0,0.25)]"
          style={{
            background:
              "linear-gradient(to right, #8afffe 15%, #00ffb8 50%, #ff6e94 88%)",
          }}
        />

        <div
          className="absolute top-full flex -translate-x-1/2 flex-col items-center"
          style={{ left: `${fraction * 100}%` }}
        >
          <Image
            src="/missions/gauge-pointer-triangle.svg"
            alt=""
            aria-hidden="true"
            width={18}
            height={16}
          />
          <div className="rounded-[5px] bg-[#ffdb8f] px-[5px] py-[5px] drop-shadow-[0px_2px_2.25px_rgba(73,49,3,0.25)]">
            <p className="font-korean text-[20px] font-semibold text-black">
              {Math.round(clamped)}°C
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
