import { NextRequest, NextResponse } from "next/server";
import { sleep } from "@/lib/time";
import { forceRevalidate, routeHandler } from "@/app/api/utils";

export const GET = routeHandler(async (request: NextRequest) => {
  forceRevalidate(request);

  // simulate computation
  await sleep(100);

  return NextResponse.json({
    totalResources: Math.floor(Math.random() * 9_000_000) + 1_000_000,
  });
});
