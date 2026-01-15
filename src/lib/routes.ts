export const ROUTES = {
  main: "/",
  inventories: "/inventories",
  inventory: "/inventory/:id",
  datepickerTest: "/datepicker-test",
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
