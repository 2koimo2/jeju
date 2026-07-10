import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/utils/supabase/server";
import { requirePersona } from "@/lib/onboarding";
import { signOut } from "@/app/auth/actions";

export default async function MyPageSettings() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  await requirePersona(supabase, user.id);

  return (
    <div className="flex min-h-full flex-col bg-[#f7eedd] px-4 pt-6 pb-16">
      <Link href="/mypage" className="font-korean text-sm text-[#978f88]">
        &lt; 마이페이지
      </Link>

      <h1 className="font-korean mt-4 text-xl font-bold text-[#262321]">
        설정
      </h1>

      <div className="mt-6 rounded-[15px] bg-white p-4">
        <p className="font-korean text-sm text-[#978f88]">로그인 계정</p>
        <p className="font-korean mt-1 text-base font-medium text-[#262321]">
          {user.email}
        </p>
      </div>

      <form action={signOut} className="mt-6">
        <button
          type="submit"
          className="font-korean w-full rounded-full border border-[#dad4c8] px-5 py-3 text-sm font-medium text-[#644c0f]"
        >
          로그아웃
        </button>
      </form>
    </div>
  );
}
