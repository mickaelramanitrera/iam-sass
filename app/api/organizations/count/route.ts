import { NextRequest, NextResponse } from "next/server";
import { sleep } from "@/lib/time";

export const GET = async (_: NextRequest) => {
  // simulate computation
  await sleep(4000);

  return NextResponse.json({ count: Math.floor(Math.random() * 30) + 1 });
};
