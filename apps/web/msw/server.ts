import { setupServer } from "msw/node";
import handlers from "./handlers";

// TODO MSW not working yet with app router
// follow along with https://github.com/mswjs/msw/issues/1644
export const server = setupServer(...handlers);
