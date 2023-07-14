import { rest } from "msw";
import { createRoute } from "../utils";

const baseRoute = "organizations";

export const handlers = [
  rest.get(createRoute(`${baseRoute}/count`), (_, res, ctx) => {
    return res(ctx.status(200), ctx.json({ count: 23 }));
  }),
];
