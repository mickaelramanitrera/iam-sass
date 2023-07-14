export const createRoute = (relativeRoute: string): string => {
  const baseRoute = "api/";
  const sanitizedRelativeRoute = relativeRoute
    .trim()
    .replace(/^\//, "")
    .replace(/\/$/, "");

  return `${baseRoute}${sanitizedRelativeRoute}`;
};
