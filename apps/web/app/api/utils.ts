import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

export const forceRevalidate = (request: NextRequest) => {
  const path = request.nextUrl.searchParams.get("path") || "/";
  revalidatePath(path);
};

type HandlerType = (request: NextRequest) => Promise<NextResponse>;

export const routeHandler =
  (handler: HandlerType) => async (request: NextRequest) => {
    try {
      return await handler(request);
    } catch (e) {
      return NextResponse.json(
        {
          error: (e as Error)?.message,
          errorStatus: (e as any)?.status || 500,
        },
        { status: 500 }
      );
    }
  };
