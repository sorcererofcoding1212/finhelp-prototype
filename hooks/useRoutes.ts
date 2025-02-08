import { usePathname } from "next/navigation";
import { useMemo } from "react";

export const useRoutes = () => {
  const pathName = usePathname();
  const routes = useMemo(
    () => [
      {
        label: "My profile",
        active: pathName === "/profile",
        href: "/profile",
      },
      {
        label: "Check balance",
        active: pathName === "/balance",
        href: "/balance",
      },
      {
        label: "Create a record",
        active: pathName === "/accounts/create",
        href: "/accounts/create",
      },
      {
        label: "Search a record",
        active: pathName === "/accounts/search",
        href: "/accounts/search",
      },
      {
        label: "Settings",
        active: pathName === "/settings",
        href: "/settings",
      },
    ],
    [pathName]
  );
  return routes;
};
