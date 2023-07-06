import { NextRequest, NextResponse } from "next/server";
import { sleep } from "@/lib/time";
import { forceRevalidate, routeHandler } from "@/app/api/utils";

export const GET = routeHandler(async (request: NextRequest) => {
  forceRevalidate(request);

  // simulate computation
  await sleep(5000);

  return NextResponse.json({ count: Math.floor(Math.random() * 20000) + 1400 });
});
