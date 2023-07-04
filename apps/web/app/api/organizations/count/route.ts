import { sleep } from "@/lib/time";
import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";

export const GET = async (_: NextRequest) => {
  const headersList = headers();
  const bearerToken = headersList
    .get("authorization")
    ?.replace(/bearer /gi, "");

  // Fake datas if no keycloak provider is set
  // thank you NextJS for the udefined as a string :(
  if (!bearerToken || bearerToken === "undefined") {
    return NextResponse.json({ count: Math.floor(Math.random() * 30) + 1 });
  }

  await sleep(2000);

  return NextResponse.json({ count: Math.floor(Math.random() * 30) + 1 });
};
