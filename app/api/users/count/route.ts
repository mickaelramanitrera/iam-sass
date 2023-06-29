import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { sleep } from "@/lib/time";

export const GET = async (_: NextRequest) => {
  const cookieStore = cookies();
  const currentUser = cookieStore.get("user");
  const currentUserDatas: { email?: string; connected?: boolean } = JSON.parse(
    currentUser?.value || ""
  );

  if (!currentUserDatas?.connected) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  // simulate computation
  await sleep(5000);

  return NextResponse.json({ count: Math.floor(Math.random() * 4000) + 14 });
};
