"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useSelector } from "react-redux";

interface Props {
  children: React.ReactNode;
}

export default function ReduxGuard({ children }: Props) {
  const router = useRouter();
  const pathname = usePathname() ?? "";

  const users = useSelector((state: any) => state.AdminUsers);
  const fullInfo = useSelector((state: any) => state.AdminFullInfo);
  const deployment = useSelector((state: any) => state.AdminDeployment);

  // Pages that don't require authentication or Redux
  const PUBLIC_ROUTES = new Set([
    "/",
    "/sign-in",
  ]);

  const hasReduxData =
    users?.length > 0 &&
    fullInfo?.length > 0 &&
    deployment?.length > 0;

  useEffect(() => {
    // Redux validation - check first before anything else
    if (!hasReduxData && !PUBLIC_ROUTES.has(pathname)) {
      console.log("Redux data missing.");
      router.replace("/");
      return;
    }

    // Skip public pages
    if (PUBLIC_ROUTES.has(pathname)) return;

    // localStorage only exists in browser
    if (typeof window === "undefined") return;

    const userId = window.localStorage.getItem("UserId");

    // Authentication check
    if (!userId) {
      console.log("User not logged in.");
      router.replace("/sign-in");
      return;
    }
  }, [pathname, hasReduxData, router]);

  return <>{children}</>;
}