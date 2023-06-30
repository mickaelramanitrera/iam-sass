import { NextRequest, NextResponse } from "next/server";
import { sleep } from "@/lib/time";
import { forceRevalidate } from "@/app/api/utils";

export const GET = async (request: NextRequest) => {
  forceRevalidate(request);

  // simulate computation
  await sleep(4000);

  return NextResponse.json({ count: Math.floor(Math.random() * 30) + 1 });
};
