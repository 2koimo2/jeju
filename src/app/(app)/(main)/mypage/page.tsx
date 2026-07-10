import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { requirePersona } from "@/lib/onboarding";
import { signOut } from "@/app/auth/actions";

export default async function MyPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  await requirePersona(supabase, user.id);

  return (
    <div className="flex min-h-full flex-col items-center justify-center gap-6 bg-[#f7eedd] px-6 py-16 text-center">
      <div>
        <p className="font-korean text-lg font-bold text-[#262321]">
          마이페이지
        </p>
        <p className="font-korean mt-2 text-sm text-[#978f88]">
          {user.email} 계정으로 로그인했어요
        </p>
        <p className="font-korean mt-4 text-sm text-[#978f88]">
          준비 중이에요. 곧 만나볼 수 있어요!
        </p>
      </div>

      <form action={signOut}>
        <button
          type="submit"
          className="font-korean rounded-full border border-[#dad4c8] px-5 py-2 text-sm font-medium text-[#644c0f]"
        >
          로그아웃
        </button>
      </form>
    </div>
  );
}
