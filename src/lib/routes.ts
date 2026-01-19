export const ROUTES = {
  main: "/",
  inventories: "/inventories",
  inventory: "/inventories/:id",
  admin: "/admin",
  profile: "/profile",
};

const generatePath = (
  path: string,
  params: Record<string, string | number>
) => {
  return Object.entries(params).reduce(
    (acc, [key, value]) => acc.replace(`:${key}`, String(value)),
    path
  );
};
