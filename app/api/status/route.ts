import { NextRequest, NextResponse } from "next/server";
import { sleep } from "@/lib/time";
import { forceRevalidate } from "@/app/api/utils";

export const GET = async (request: NextRequest) => {
  forceRevalidate(request);

  // simulate computation
  await sleep(300);

  return NextResponse.json({
    speed: Math.floor(Math.random() * 50) + 10,
    activeConnections: Math.floor(Math.random() * 10_000) + 3_800,
    totalResources: Math.floor(Math.random() * 9_000_000) + 1_000_000,
  });
};
